import {useEffect, useRef, useState} from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts"
import {useQuery,} from 'react-query';
import {useCodeStore, useSessionStore} from "./state.js";
import {Configuration, DefaultApi} from "../openapi";
import {useDebounce} from "@uidotdev/usehooks";
import {toast} from 'react-toastify';

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
      retry: false,
      retryOnMount: true,
      onError: (error: any) => {
        const errorMessage = error.response.data?.error || 'An unknown server error occurred.';
        const match = errorMessage.match(/(.*)-(.*)/); // Match ERROR- and everything that follows
        const name = match ? match[2] : error;
        if (errorMessage.includes("NO_SPACE_TO_PLACE")) {
          toast.error('You can\'t supperpose clip ' + name + ' with another one.', {
              type: 'error',
              autoClose: false,
              toastId: 'no-space-toast',
              position: 'top-center'
            }
          );
        } else if (errorMessage.includes("CUT_TO_LONG")) {
          toast.error('The cut on ' + name + ' doesn\'t fit the media duration',
            {
              type: 'error',
              autoClose: false,
              toastId: 'cut-to-long-toast',
              position: 'top-center'
            });
        } else if (errorMessage.includes("WRONG_REFERENCE")) {
          toast.error(name + ' is not on the timeline', {
            type: 'error',
            autoClose: false,
            toastId: 'wrong-reference-toast',
            position: 'top-center'
          });
        } else if (errorMessage.includes("VIDEO_FILEPATH") || errorMessage.includes("AUDIO_FILEPATH")) {
          toast.error('Wrong file path ' + name, {
            type: 'error',
            autoClose: false,
            toastId: 'wrong-filepath-toast',
            position: 'top-center'
          });
        }
      },
      onSuccess: (data) => {
        // clear all toasts
        toast.dismiss();
      }
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
          const {
            milliseconds: startMilliseconds,
            seconds: startSeconds,
            minutes: startMinutes,
            hours: startHours
          } = getTime(w.globals.seriesRangeStart[seriesIndex][dataPointIndex]);
          const {
            milliseconds: endMilliseconds,
            seconds: endSeconds,
            minutes: endMinutes,
            hours: endHours
          } = getTime(w.globals.seriesRangeEnd[seriesIndex][dataPointIndex]);
          return `<div
            <div style="margin-bottom: 8px;">
              <span style="font-weight: bold; color: #333;">Start Time:</span>
              <div style="font-family: monospace; color: #555;">
                <span>${startHours} <strong>Hours</strong> </span>
                <span>${startMinutes} <strong>Minutes</strong></span>
                <span>${startSeconds} <strong>Seconds</strong></span>
                <span>${startMilliseconds} <strong>Milliseconds</strong></span>
              </div>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="font-weight: bold; color: #333;">End Time:</span>
              <div style="font-family: monospace; color: #555;">
                <span>${endHours} <strong>Hours</strong> </span>
                <span>${endMinutes} <strong>Minutes</strong></span>
                <span>${endSeconds} <strong>Seconds</strong></span>
                <span>${endMilliseconds} <strong>Milliseconds</strong></span>
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
