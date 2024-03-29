/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-underscore-dangle */
import * as helpers from "chart.js/helpers";

export const createTooltip = (context) => {
    const { chart, tooltip } = context;
    let tooltipEl: any = document.body.querySelector("#chartjs-tooltip");

    if (!tooltipEl) {
        // Create tooltip
        tooltipEl = document.createElement("div");
        tooltipEl.style.pointerEvents = "none";
        tooltipEl.style.position = "fixed";
        tooltipEl.style["z-index"] = "100";
        tooltipEl.style.transition = "all .1s ease";
        tooltipEl.style.overflow = "auto";
        tooltipEl.style["border-radius"] = "15px";
        tooltipEl.setAttribute("id", "chartjs-tooltip");

        // Create content div
        const bodyDiv = document.createElement("DIV");
        bodyDiv.classList.add("body");
        tooltipEl.appendChild(bodyDiv);

        // Add to chart
        document.body.appendChild(tooltipEl);
    }

    // Set position
    const chartPosition = chart.canvas.getBoundingClientRect();
    const tooltipXPosition = chartPosition.x + tooltip._eventPosition.x;
    tooltipEl.style.top = String(chartPosition.y + tooltip._eventPosition.y) + "px";
    tooltipEl.style.left = String(tooltipXPosition) + "px";
    tooltipEl.style.transform = "translate(" + ((tooltipXPosition * 1.2) > window.innerWidth ? "-110%" : "10%") + ", -50%)";
    return tooltipEl;
}

export const barChartValues = function(chart) {
    const ctx = chart.ctx;
    ctx.textAlign = "left";
    helpers.each(chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        helpers.each(meta.data.forEach((bar, index) => {
            ctx.fillText(
                new Intl.NumberFormat("en-GB", chart.options.scales["x"].ticks.format).format(dataset.data[index]),
                Number(bar.base) + 5,
                Number(bar.y) + 4
            );
        }),this)
    }),this);
}

export const barChartLabels = function(chart) {
    const ctx = chart.ctx;
    ctx.textAlign = "left";
    helpers.each(chart.data.labels.forEach((label, i) => {
        const meta = chart.getDatasetMeta(i);
        helpers.each(meta.data.forEach((bar, index) => {
            const text = chart.data.labels[index];

            // Add background
            if(chart?.config?.options?.plugins?.barChartLabels?.backdropColor) {
                const padding = 5;
                const width = ctx.measureText(text).width;
                ctx.fillStyle = chart?.config?.options?.plugins?.barChartLabels?.backdropColor;
                ctx.fillRect(
                    Number(bar.base) + 5 - (padding / 2),
                    bar.y - 5 - (padding / 2),
                    Number(width) + Number(padding),
                    10 + padding,
                );
            }

            // Write text
            ctx.fillStyle = "#000";
            ctx.fillText(text, Number(bar.base) + 5, Number(bar.y) + 4);
        }),this)
    }),this);
}

export const matrixChartLabels = function(chart) {
    const ctx = chart.ctx;
    ctx.textAlign = "left";
    helpers.each(chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        helpers.each(meta.data.forEach((bar: any) => {
            ctx.textAlign = "center";
            ctx.fillText(
                numberWithCommas(bar.$context.raw.v),
                Number(bar.x) + (bar.width / 2),
                Number(bar.y) + (bar.height / 2)
            );
        }),this)
    }),this);
}

export const numberWithCommas = (x): string => {
    if (x === null || typeof x === "undefined") {
        return "Nothing selected";
    } else {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}