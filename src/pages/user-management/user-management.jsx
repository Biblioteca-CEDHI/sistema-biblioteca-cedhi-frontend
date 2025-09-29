import PropTypes from 'prop-types';
import { useMemo, useState, Fragment } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
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
import Avatar from '../../components/@extended/Avatar';
import IconButton from '../../components/@extended/IconButton';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from '../../config';

import UserManagementModal from '../../sections/user-management/UserManagementModal';
import AlertUserManagementDelete from '../../sections/user-management/AlertUserManagementDelete';
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

import { useGetUserCedhi } from '../../api/users';

// assets
import { Add, Edit, Trash } from 'iconsax-react';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler }) {
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
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Agregar Usuario
          </Button>
          <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'users-list.csv' }}
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
// ==============================|| USERS LIST ||============================== //

export default function UserManagementListPage() {
  const theme = useTheme();

  const { usersLoading: loading, users: lists } = useGetUserCedhi();

  const [open, setOpen] = useState(false);

  const [userManagementModal, setUserManagementModal] = useState(false);
  const [selecteduserManagement, setSelectedUserManagement] = useState(null);
  const [userManagementDeleteId, setUserManagementDeleteId] = useState('');

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
        header: 'DNI',
        accessorKey: 'codigo',
        meta: {
          className: 'cell-center'
        }
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
        header: 'categoria',
        accessorKey: 'categoria',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Género',
        accessorKey: 'sexo',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              { row.original.sexo === 'M' ?
              <Typography color="text.secondary">Masculino</Typography>
              : <Typography color="text.secondary">Femenino</Typography>
              }
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Actiones',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUserManagement(row.original);
                    setUserManagementModal(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setUserManagementDeleteId(Number(row.original.codigo));
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ], // eslint-disable-next-line
    [theme]
  );

  if (loading) return <EmptyReactTable />;

  let breadcrumbLinks = [{ title: 'Inicio', to: APP_DEFAULT_PATH }, { title: 'Usuarios', to: '/user-management/list' }, { title: 'Lista' }];

  return (
    <>
    <Breadcrumbs custom heading="Lista de Usuarios" links={breadcrumbLinks} />
      <ReactTable
        {...{
          data: lists,
          columns,
          modalToggler: () => {
            setUserManagementModal(true);
            setSelectedUserManagement(null);
          }
        }}
      />
      <AlertUserManagementDelete id={Number(userManagementDeleteId)} usuarioDNI={userManagementDeleteId} open={open} handleClose={handleClose} />
      <UserManagementModal open={userManagementModal} modalToggler={setUserManagementModal} userManagement={selecteduserManagement} />
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };
