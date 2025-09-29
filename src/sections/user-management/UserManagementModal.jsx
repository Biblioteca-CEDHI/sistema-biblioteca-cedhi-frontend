import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormUserManagementAdd from './FormUserManagementAdd';
import MainCard from '../../components/MainCard';
import SimpleBar from '../../components/third-party/SimpleBar';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import usuariosCedhiList from '../../data/usuariosCedhi';

// ==============================|| USER MANAGEMENT ADD / EDIT ||============================== //

export default function UserManagementModal({ open, modalToggler, userManagement }) {
  const { usuariosCedhiLoading: loading } = usuariosCedhiList;

  const closeModal = () => modalToggler(false);

  const userManagementForm = useMemo(
    () => !loading && <FormUserManagementAdd userManagement={userManagement || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [userManagement, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-userManagement-add-label"
          aria-describedby="modal-userManagement-add-description"
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
                userManagementForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}

UserManagementModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, userManagement: PropTypes.any };