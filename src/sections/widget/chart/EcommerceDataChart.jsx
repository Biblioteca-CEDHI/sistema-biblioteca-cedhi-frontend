import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from '../../../config';

// ==============================|| CHART - ECOMMERCE DATA CHART ||============================== //

export default function EcommerceDataChart({ color, height }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      type: 'bar',
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false
      },
      offsetX: -2
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '80%'
      }
    },
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [color],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
        //background: 'transparent'
      }
    }));
  }, [color, mode, primary, secondary, line, theme]);

  const [series] = useState([
    {
      name: 'Libros',
      data: [30, 60, 40, 70, 50, 90, 50, 55, 45, 60, 50, 65]
    },
  ]);

  return <ReactApexChart options={options} series={series} type="bar" height={height ? height : 50} />;
}

EcommerceDataChart.propTypes = { color: PropTypes.string, height: PropTypes.number };
