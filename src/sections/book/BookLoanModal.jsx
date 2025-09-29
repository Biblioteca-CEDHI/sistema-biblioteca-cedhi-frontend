import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormBookLoanAdd from './FormBookLoanAdd';
import MainCard from '../../components/MainCard';
import SimpleBar from '../../components/third-party/SimpleBar';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { useGetBooks } from '../../api/books';
import { useGetUserCedhi } from '../../api/users';

// ==============================|| BOOK - PREVIEW ||============================== //

export default function BookLoanModal({ open, modalToggler, bookLoan, perfilesCedhi }) {
  const { booksLoading } = useGetBooks();
  const { usersLoading } = useGetUserCedhi();

  const loading = booksLoading === true && usersLoading === true ? true : false;

  const closeModal = () => modalToggler(false);

  const customerForm = useMemo(
    () => !loading && <FormBookLoanAdd customer={bookLoan || null} closeModal={closeModal} perfiles={perfilesCedhi || null}/>,
    // eslint-disable-next-line
    [bookLoan, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                customerForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}

BookLoanModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, bookLoan: PropTypes.any };
