import {useEffect, useRef, useState} from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts"
import {useQuery,} from 'react-query';
import {useCodeStore, useSessionStore} from "./state.js";
import {Configuration, DefaultApi} from "../openapi";
import {useDebounce} from "@uidotdev/usehooks";

function getTime(totalMilliseconds) {
  const milliseconds = Math.floor(totalMilliseconds % 1000);
  const seconds = Math.floor((totalMilliseconds / 1000) % 60);
  const minutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((totalMilliseconds / (1000 * 60 * 60)) % 24);
  return {milliseconds, seconds, minutes, hours};
}

export const Timeline = (
  props: {
    height: string;
  }
) => {
  const ref = useRef<any>(null);
  const code = useCodeStore((state) => state.code);
  const debouncedCode = useDebounce(code, 500);
  const sessionId = useSessionStore((state) => state.session);
  // useQuery
  const query = useQuery(['timeline', debouncedCode], async () => {
      const api = new DefaultApi(
        new Configuration({
          basePath: 'http://localhost:5001'
        })
      );
      return (await api.sessionIdTimelinePost(sessionId, {
        langium: code,
      })).data;
    }, {
      refetchOnWindowFocus: true
    }
  );


  useEffect(() => {
    // set Timeout to wait for the chart to be rendered

    const timeout = setTimeout(() => {

        const chart = ref.current;
        if (chart) {
          ApexCharts.exec('chart', 'updateOptions', {
              plotOptions: {
                bar: {
                  horizontal: true,
                  barHeight: '80%'
                }
              }
            }
          );
        }
      }
      , 100);
    return () => {
      clearTimeout(timeout);
    }
  }, []);
  const [state,] = useState({

    series: [],
    options: {
      tooltip: {
        custom: function ({series, seriesIndex, dataPointIndex, w}: {
          series: any;
          seriesIndex: number;
          dataPointIndex: number;
          w: any;
        }) {
          const {milliseconds: startMilliseconds, seconds: startSeconds, minutes: startMinutes, hours: startHours} = getTime( w.globals.seriesRangeStart[seriesIndex][dataPointIndex]);
          const {milliseconds: endMilliseconds, seconds: endSeconds, minutes: endMinutes, hours: endHours} = getTime( w.globals.seriesRangeEnd[seriesIndex][dataPointIndex]);
          return   `<div
            <div style="margin-bottom: 8px;">
              <span style="font-weight: bold; color: #333;">Start Time:</span>
              <div style="font-family: monospace; color: #555;">
                <span><strong>Hours:</strong> ${startHours}</span>
                <span><strong>Minutes:</strong> ${startMinutes}</span>
                <span><strong>Seconds:</strong> ${startSeconds}</span>
                <span><strong>Milliseconds:</strong> ${startMilliseconds}</span>
              </div>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="font-weight: bold; color: #333;">End Time:</span>
              <div style="font-family: monospace; color: #555;">
                <span><strong>Hours:</strong> ${endHours}</span>
                <span><strong>Minutes:</strong> ${endMinutes}</span>
                <span><strong>Seconds:</strong> ${endSeconds}</span>
                <span><strong>Milliseconds:</strong> ${endMilliseconds}</span>
              </div>
            </div>
          </div>`;
        }
      },
      chart: {
        id: 'chart',
        height: props.height,
        type: 'rangeBar'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%'
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: function (value: any, timestamp: string | number | Date, opts: {
            dateFormatter: (arg0: Date) => {
              (): any;
              new(): any;
              format: {
                (arg0: string): any;
                new(): any;
              };
            };
          }) {
            console.log(value, timestamp, opts);
            // map to hours and minutes and  seconds from 2019-03-05T00:00:00
            const {milliseconds, seconds, minutes, hours} = getTime(value);

            return hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
          }
        }
      },
      stroke: {
        width: 1
      },
      fill: {
        type: 'solid',
        opacity: 0.6
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      }
    },


  } as {
    series: any[];
    options: ApexCharts.ApexOptions;
  });
  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <div id="chart"
           style={{
             width: '100%',
             height: '100%'
           }}
           ref={ref}
      >
        <ReactApexChart
          options={state.options} series={query.data ? query.data.timeline : state.series} type="rangeBar"
          height={'100%'}/>
      </div>
      <div id="html-dist"></div>
    </div>
  );

}
