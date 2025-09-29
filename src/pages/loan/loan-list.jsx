import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { format } from "date-fns";

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-import
import useAuth from '../../hooks/useAuth';
import ScrollX from '../../components/ScrollX';
import MainCard from '../../components/MainCard';
import Avatar from '../../components/@extended/Avatar';
import IconButton from '../../components/@extended/IconButton';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import EmptyReactTable from '../../pages/tables/react-table/empty';
import AlertLoanDelete from '../../sections/loan/AlertLoanDelete';
import LoanReturnModal from '../../sections/loan/LoanReturnModal';

import { APP_DEFAULT_PATH } from '../../config';
import { useGetLoans } from '../../api/loans';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from '../../components/third-party/react-table';

// assets
import { BackSquare, Trash } from 'iconsax-react';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns }) {
  const groups = ['Todo', ...new Set(data.map((item) => item.estado))];

  const countGroup = data.map((item) => item.estado);
  const counts = countGroup.reduce(
    (acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);
  const [sorting, setSorting] = useState([{ id: 'nombres', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: false
  });

  let headers = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );

  useEffect(() => {
    setColumnFilters(activeTab === 'Todo' ? [] : [{ id: 'estado', value: activeTab }]);
  }, [activeTab]);

  return (
    <MainCard content={false}>
      <Box sx={{ p: 2.5, pb: 0, width: '100%' }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {groups.map((estado, index) => (
            <Tab
              key={index}
              label={estado}
              value={estado}
              icon={
                <Chip
                  label={
                    estado === 'Todo'
                      ? data.length
                      : estado === 'Prestado'
                        ? counts.Prestado
                        : estado === 'Atrasado'
                          ? counts.Atrasado
                          : counts.Devuelto
                  }
                  color={estado === 'Todo' ? 'primary' : estado === 'Devuelto' ? 'success' : estado === 'Prestado' ? 'warning' : 'error'}
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2.5 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Buscar en ${data.length} registros...`}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'loans-list.csv' }}
          />
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select'
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount,
                  initialPageSize: 10
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| INVOICE - LIST ||============================== //

export default function List() {
  const { user } = useAuth();

  const { loansLoading, loans: list } = useGetLoans();

  const [open, setOpen] = useState(false);
  const [loanReturnModal, seLoanReturnModal] = useState(false);
  const [selectedLoanReturn, setLoanReturn] = useState(null);

  const [loanDeleteId, setLoanDeleteId] = useState('');


  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        id: 'Row Selection',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        header: 'Id',
        accessorKey: 'id_prestamo',
        meta: { className: 'cell-center' }
      },
      {
        header: 'Usuario',
        accessorKey: 'nombres',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar alt="Avatar" size="sm">
              {row.original.nombres.charAt(0)}
            </Avatar>
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography color="text.secondary">{row.original.email}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Libro',
        accessorKey: 'titulo',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography color="text.secondary">{row.original.registro}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Prestamo',
        accessorKey: 'fecha_prestamo',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography color="text.secondary">{format(new Date(row.original.fecha_prestamo), "dd/MM/yyyy HH:mm:ss")}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Estimado',
        accessorKey: 'fecha_devolucion_estimada',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography color="text.secondary">{format(new Date(row.original.fecha_devolucion_estimada), "dd/MM/yyyy HH:mm:ss")}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Devolución',
        accessorKey: 'fecha_devolucion_real',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              { row.original.fecha_devolucion_real ?
              <Typography color="text.secondary">{format(new Date(row.original.fecha_devolucion_real), "dd/MM/yyyy HH:mm:ss")}</Typography>
              : <Typography color="text.secondary">Sin fecha</Typography>
              }
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 'Prestado':
              return <Chip color="info" label="Prestado" size="small" variant="light" />;
            case 'Atrasado':
              return <Chip color="error" label={`Atrasado ${cell.row.original.dias} días`} size="small" variant="light" />;
            case 'Saldado':
            default:
              return <Chip color="success" label="Saldado" size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Acciones',
        meta: { className: 'cell-center' },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Devolución">
                <span>
                  <IconButton
                    disabled={!row.original.estado || row.original.estado === 'Devuelto'}
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoanReturn(row.original);
                      seLoanReturnModal(true);
                    }}
                  >
                    <BackSquare />
                  </IconButton>
                </span>
              </Tooltip>
              {user?.categoria === 1 ? (
                <Tooltip title="Eliminar">
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                      setLoanDeleteId(row.original.id_prestamo);
                    }}
                  >
                    <Trash />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}
            </Stack>
          );
        }
      }
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  let breadcrumbLinks = [{ title: 'Inicio', to: APP_DEFAULT_PATH }, { title: 'Prestamos', to: '/loans/list' }, { title: 'Lista' }];
  return (
    <>
      <Breadcrumbs custom heading="Lista de Prestamos" links={breadcrumbLinks} />
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
        <Grid item xs={12}>
          {loansLoading ? <EmptyReactTable /> : <ReactTable {...{ data: list, columns, modalToggler: () => {
            seLoanReturnModal(true);
            setLoanReturn(null);
          } }} />}
          <AlertLoanDelete id={Number(loanDeleteId)} open={open} handleClose={handleClose} />
          <LoanReturnModal open={loanReturnModal} modalToggler={seLoanReturnModal} loanReturn={selectedLoanReturn} />
        </Grid>
      </Grid>
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array };
