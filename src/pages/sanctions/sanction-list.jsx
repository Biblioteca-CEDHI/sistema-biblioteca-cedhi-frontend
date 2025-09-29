import PropTypes from 'prop-types';
import { useMemo, useState, Fragment } from 'react';
import { format } from "date-fns";

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';

// project-import
import MainCard from '../../components/MainCard';
import ScrollX from '../../components/ScrollX';
import IconButton from '../../components/@extended/IconButton';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import AlertSanctionDesactivate from '../../sections/sanctions/AlertSanctionDesactivate';

import { APP_DEFAULT_PATH } from '../../config';

//import CustomerModal from '../../sections/apps/customer/CustomerModal';
//import AlertCustomerDelete from '../../sections/apps/customer/AlertCustomerDelete';
//import CustomerView from '../../sections/apps/customer/CustomerView';
import EmptyReactTable from '../../pages/tables/react-table/empty';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from '../../components/third-party/react-table';

import { useGetSancions } from '../../api/sanctions';

// assets
import { NoteRemove } from 'iconsax-react';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns }) {
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

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Buscar en ${data.length} registros...`}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'sanctions-list.csv' }}
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
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fragment>
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
                  getPageCount: table.getPageCount
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function CustomerListPage() {
  const theme = useTheme();

  const { sanctionsLoading: loading, sanctions: lists } = useGetSancions();

  const [open, setOpen] = useState(false);

  const [customerDeleteId, setCustomerDeleteId] = useState('');

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
        header: 'ID ',
        accessorKey: 'id_sancion',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Usuario',
        accessorKey: 'nombres',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography variant="subtitle1">DNI: {row.original.id_usuario}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Creado',
        accessorKey: 'createdAt',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              { row.original.createdAt ?
              <Typography color="text.secondary">{format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm:ss")}</Typography>
              : <Typography color="text.secondary">Sin fecha</Typography>
              }
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Tipo Sancion / días',
        accessorKey: 'tipo_sancion',
        cell: ({ getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography color="text.secondary">{getValue()} días</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        dataType: 'select',
        cell: (cell) => {
          switch (cell.getValue()) {
            case true:
              return <Chip color="info" label="Activo" size="small" variant="light" />;
            case false:
              return <Chip color="error" label="No Activo" size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Acciones',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Remover sanción">
              <span>
                <IconButton
                  disabled={!row.original.estado}
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setCustomerDeleteId(Number(row.original.id_sancion));
                  }}
                >
                  <NoteRemove />
                </IconButton>
                </span>
              </Tooltip>
            </Stack>
          );
        }
      }
    ], // eslint-disable-next-line
    [theme]
  );

  if (loading) return <EmptyReactTable />;

  let breadcrumbLinks = [{ title: 'Inicio', to: APP_DEFAULT_PATH }, { title: 'Sanciones', to: '/sanctions/list' }, { title: 'Lista' }];

  return (
    <>
      <Breadcrumbs custom heading="Lista de Sanciones" links={breadcrumbLinks} />
      <ReactTable
        {...{
          data: lists,
          columns,
        }}
      />

      <AlertSanctionDesactivate id={Number(customerDeleteId)} title={customerDeleteId.toString()} open={open} handleClose={handleClose}/>
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array };
