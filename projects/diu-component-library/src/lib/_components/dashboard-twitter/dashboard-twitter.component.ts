import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { iNewsFeed } from "../../_models/installations.interface";
import { APIService } from "../../_services/api.service";
import { ResizeService } from "../../_services/resize.service";
declare const window: any;

@Component({
    selector: "app-dashboard-twitter",
    templateUrl: "./dashboard-twitter.component.html",
    styles: [`
        button.nav {
            position: absolute;
            z-index: 1000;
            top: 50%;
            margin-top: -25px;
        }
        button.nav:disabled {
            display: none;
        }
        button.nav.left {
            left: 15px;
        }
        button.nav.right {
            right: 15px;
        }
    `]
})
export class DashboardTwitterComponent implements OnInit, AfterViewChecked {

    twitterfeeds: iNewsFeed[] = [];
    settings = { display: false, numCols: 3, index: 0, total: 0 };
    isIE = /msie\s|trident\//i.test(window.navigator.userAgent);

    constructor(
        private apiService: APIService,
        private resizeSvc: ResizeService,
        private cdRef: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) {
        this.resizeSvc.onResize$.subscribe((x) => {
            this.settings.numCols = x;
        });
    }

    ngOnInit() {
        this.apiService.getNewsFeeds().subscribe((data: iNewsFeed[]) => {
            // Display feeds
            this.settings.display = true;

            // Retrieve feeds
            const twitterfeeds =  data.filter((x) => x.type === "Twitter");
            this.settings.total = twitterfeeds.length;
            this.twitterfeeds = twitterfeeds
                .sort((a, b) => parseInt(b.priority) - parseInt(a.priority))
                .map((feed) => {
                    feed.html = this.sanitizer.bypassSecurityTrustHtml(`
                        <a class=twitter-timeline href=https://twitter.com/${feed.destination}?ref_src=twsrc%5Etfw></a>
                        <script src=https://platform.twitter.com/widgets.js charset=utf-8></script>
                    `);
                    return feed;
                });
        });
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    nextSlide() {
        if((this.settings.index + this.settings.numCols + 1) <= this.settings.total) {
            this.settings.index += 1;
        }
    }

    previousSlide() {
        if(this.settings.index !== 0) {
            this.settings.index -= 1;
        }
    }
}
