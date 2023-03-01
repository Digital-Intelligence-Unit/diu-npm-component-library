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
                    // eslint-disable-next-line max-len
                    feed.html = this.sanitizer.bypassSecurityTrustResourceUrl(`https://syndication.twitter.com/srv/timeline-profile/screen-name/${feed.destination}?dnt=false&embedId=twitter-widget-0&features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfaG9yaXpvbl90aW1lbGluZV8xMjAzNCI6eyJidWNrZXQiOiJ0cmVhdG1lbnQiLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3R3ZWV0X2VkaXRfYmFja2VuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfcmVmc3JjX3Nlc3Npb24iOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYnVzaW5lc3NfdmVyaWZpZWRfYmFkZ2UiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2NoaW5fcGlsbHNfMTQ3NDEiOnsiYnVja2V0IjoiY29sb3JfaWNvbnMiLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3R3ZWV0X3Jlc3VsdF9taWdyYXRpb25fMTM5NzkiOnsiYnVja2V0IjoidHdlZXRfcmVzdWx0IiwidmVyc2lvbiI6bnVsbH0sInRmd19taXhlZF9tZWRpYV8xNTg5NyI6eyJidWNrZXQiOiJ0cmVhdG1lbnQiLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3NlbnNpdGl2ZV9tZWRpYV9pbnRlcnN0aXRpYWxfMTM5NjMiOnsiYnVja2V0IjoiaW50ZXJzdGl0aWFsIiwidmVyc2lvbiI6bnVsbH0sInRmd19leHBlcmltZW50c19jb29raWVfZXhwaXJhdGlvbiI6eyJidWNrZXQiOjEyMDk2MDAsInZlcnNpb24iOm51bGx9LCJ0ZndfZHVwbGljYXRlX3NjcmliZXNfdG9fc2V0dGluZ3MiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3ZpZGVvX2hsc19keW5hbWljX21hbmlmZXN0c18xNTA4MiI6eyJidWNrZXQiOiJ0cnVlX2JpdHJhdGUiLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmx1ZV92ZXJpZmllZF9iYWRnZSI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0Zndfc2hvd19nb3ZfdmVyaWZpZWRfYmFkZ2UiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYnVzaW5lc3NfYWZmaWxpYXRlX2JhZGdlIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd190d2VldF9lZGl0X2Zyb250ZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH19&frame=false&hideBorder=false&hideFooter=false&hideHeader=false&hideScrollBar=false&lang=en&origin=https%3A%2F%2Fpublish.twitter.com%2F%23&sessionId=010f1e597d6f71f25586dd1e5e4943z8cef68fafd&showHeader=true&showReplies=false&transparent=false&widgetsVersion=2b959255e8896%3A1673658205745`);
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
