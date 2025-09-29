import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormBookAdd from './FormBookAdd';
import MainCard from '../../components/MainCard';
import SimpleBar from '../../components/third-party/SimpleBar';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { useGetBooks } from '../../api/books';

// ==============================|| BOOK ADD / EDIT ||============================== //

export default function BookModal({ open, modalToggler, book }) {
  const { booksLoading: loading } = useGetBooks();

  const closeModal = () => modalToggler(false);

  const bookForm = useMemo(
    () => !loading && <FormBookAdd book={book || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [book, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-book-add-label"
          aria-describedby="modal-book-add-description"
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
                bookForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}

BookModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, book: PropTypes.any };
