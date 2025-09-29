import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// third-party
import { flexRender, useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';

// project import
import ScrollX from '../../../components/ScrollX';
import MainCard from '../../../components/MainCard';
import EmptyReactTable from '../../../pages/tables/react-table/empty';
import Avatar from '../../../components/@extended/Avatar';
import { TablePagination, HeaderSort, DebouncedInput } from '../../../components/third-party/react-table';
import { useGetRankingBooks } from '../../../api/rankingBooks';

// assets
import { Star1 } from 'iconsax-react';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, title }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false
  });

  let headers = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    })
  );

  return (
    <MainCard content={false} title={title}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h5">Ranking de Libros</Typography>
          <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Buscar en ${data.length} registros...`}
        />
        </Stack>
      </Box>
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 2.5 }}
      >

        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={2}>
          {/* <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns }} /> */}
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
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
                <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                  <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                    <TablePagination
                      {...{
                        setPageSize: table.setPageSize,
                        setPageIndex: table.setPageIndex,
                        getState: table.getState,
                        getPageCount: table.getPageCount,
                        initialPageSize: 4
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - BASIC ||============================== //

export default function RankingBooks() {
  const theme = useTheme();

  const { rankingBooksLoading, rankingBooks: list } = useGetRankingBooks();

  const columns = useMemo(
    () => [
      {
        header: 'Puesto',
        cell: (info) => <Typography variant="subtitle1">{info.row.index + 1}</Typography>
      },
      {
        header: 'Libro',
        accessorKey: 'titulo',
        cell: ({ row }) => {
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                alt="Avatar 1"
                size="lg"
                variant="rounded"
                
              >
                {row.original.titulo.charAt(0)}
                </Avatar>
              <Stack spacing={0}>
                <Typography variant="subtitle1">{row.original.titulo}</Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        header: 'Prestamos',
        accessorKey: 'total_prestamos',
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Star1 variant="Bold" color={theme.palette.warning.main} size={18} />
              <Typography variant="subtitle1">{row.original.total_prestamos}</Typography>
            </Stack>
          );
        }
      }
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
      {rankingBooksLoading ? <EmptyReactTable /> : <ReactTable {...{ data: list, columns, modalToggler: () => {} }} />}
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, title: PropTypes.string };
