import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormLoanReturn from './FormLoanReturn';
import MainCard from '../../components/MainCard';
import SimpleBar from '../../components/third-party/SimpleBar';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
//import { useGetCustomer } from 'api/customer';

export default function LoanReturnModal({open, modalToggler, loanReturn}) {
  //const { customersLoading: loading } = useGetCustomer();

  const { customersLoading: loading } = true;

  const closeModal = () => modalToggler(false);

  const loanReturnForm = useMemo(
    () => !loading && <FormLoanReturn loanReturn={loanReturn || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [loanReturn, loading]
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
                loanReturnForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}

LoanReturnModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, loanReturn: PropTypes.any };
