const sancionesList = {
  sanciones: [
    { id: 1, nombre: 'Barney Thea', email: 'barney@correo.com', DNI: 12345675, tipo_sancion: 3, numero_sanciones: 4, status_sancion: true },
    { id: 2, nombre: 'Emily Rose', email: 'emily@correo.com', DNI: 23456786, tipo_sancion: 1, numero_sanciones: 2, status_sancion: true},
    { id: 3, nombre: 'Carlos Diaz', email: 'carlos@correo.com', DNI: 34567895, tipo_sancion: 5, numero_sanciones: 3, status_sancion: false },
    { id: 4, nombre: 'Anita Gomez', email: 'anita@correo.com', DNI: 45678590, tipo_sancion: 2, numero_sanciones: 1, status_sancion: true },
    { id: 5, nombre: 'David Martin', email: 'david@correo.com', DNI: 56785901, tipo_sancion: 1, numero_sanciones: 5, status_sancion: false },
    { id: 6, nombre: 'Sara Lee', email: 'sara@correo.com', DNI: 67890712, tipo_sancion: 3, numero_sanciones: 2, status_sancion: false },
    { id: 7, nombre: 'Juan Perez', email: 'juan@correo.com', DNI: 78901423, tipo_sancion: 1 , numero_sanciones: 3, status_sancion: true },
    { id: 8, nombre: 'Lucia Rivas', email: 'lucia@correo.com', DNI: 89012334, tipo_sancion: 2, numero_sanciones: 4, status_sancion: true },
    { id: 9, nombre: 'Marco Torres', email: 'marco@correo.com', DNI: 90126345, tipo_sancion: 1, numero_sanciones: 1, status_sancion: true },
    { id: 10, nombre: 'Sofia Jimenez', email: 'sofia@correo.com', DNI: 12234568, tipo_sancion: 2, numero_sanciones: 6, status_sancion: true }
  ],
  sancionesEmpty: false,
  sancionesError: undefined,
  sancionesLoading: false,
  sancionesValidating: false
};

export default sancionesList;