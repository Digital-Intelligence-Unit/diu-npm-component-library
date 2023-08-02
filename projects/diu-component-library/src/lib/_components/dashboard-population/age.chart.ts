import Chart from "chart.js/auto";
export class AgeChart {

    id;
    chartInstance;

    constructor(sex) {
        this.id = sex;
    }

    create(htmlElement) {
        // Create new chartjs chart
        this.chartInstance = new Chart(htmlElement.nativeElement, {
            type: "bar",
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    // Align to right?
                    x: {
                        ...(this.id === "Male") && {
                            reverse: true
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ...(this.id === "Male") && {
                            position: "right",
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            },
            data: { labels: [], datasets: [] }
        });
    }

    update(data) {
        // // Get max age
        // const max = d3.max(data["AgeDimension"].values, (item: any) => {
        //     return item.key;
        // });

        // Get data by sex
        const filteredData = this._filterSex(data["AgeDimension"]);

        // Set new data
        this.chartInstance.data = {
            labels: filteredData.map((item) => item.key),
            datasets: [{
                barPercentage: 0.9,
                categoryPercentage: 1.0,
                borderColor: "#1a6395",
                backgroundColor: { Male: "#6baed6", Female: "#da3b8a" }[this.id],
                data: filteredData.map((item) => {
                    return item.value;
                }) || 0
            }]
        }

        // Update chart
        this.chartInstance.update();
    }

    _filterSex(data) {
        // Filter by
        const sexKey = { Female: "F:", Male: "M:" };
        return data.values.filter((item) => {
            return item.key.includes(sexKey[this.id]);
        }).sort((a, b) => {
            return parseInt(b.key.split(":")[1]) - parseInt(a.key.split(":")[1]);
        }).map((item) => {
            item.key = item.key.replace(sexKey[this.id], "");
            return item;
        });
    }
}