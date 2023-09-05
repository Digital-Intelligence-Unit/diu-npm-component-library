import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { cCarouselHandler, iCarouselItem } from "../../_models/componentHandler";
import { register } from "swiper/element/bundle";

@Component({
    selector: "app-carousel",
    templateUrl: "./carousel.component.html",
})
export class CarouselComponent implements OnInit, AfterViewInit {

    @ViewChild("swiperContainer") swiperContainer;

    config: any;
    Handler: cCarouselHandler;
    carouselItems: iCarouselItem[] = [];

    constructor() {}

    ngOnInit() {
        this.Handler = new cCarouselHandler(this.config);
        this.carouselItems = this.Handler.carouselItems;
    }

    ngAfterViewInit(): void {
        register();

        // Set params
        Object.assign(this.swiperContainer.nativeElement, {
            speed: 2000,
            autoplay: true,
            loop: true,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: ".swiper-pagination",
                type: "bullets",
                clickable: true
            }
        });
        this.swiperContainer.nativeElement.initialize();
    }
}
