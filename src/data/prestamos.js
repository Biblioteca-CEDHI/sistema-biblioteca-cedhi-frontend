const prestamosList = {
  prestamos: [
    { id: 1, avatar: 1, customer_name: 'Barney Thea', email: 'barney@correo.com', book_loan: 'Su majestad el Rocoto', registro_book: 1000001, start_date: "05/01/2022", estimated_date: "08/01/2022", end_date: "", status: "Prestado", dias_atradado: 3 },
    { id: 2, avatar: 2, customer_name: 'Lily Beckett', email: 'lilyb@correo.com', book_loan: 'Secretos de cocina ( Licores, bebidas y piqueos )', registro_book: 1004501, start_date: "02/15/2023", estimated_date: "03/15/2023", end_date: "", status: "Atrasado", dias_atradado: 5 },
    { id: 3, avatar: 3, customer_name: 'James Carter', email: 'jamesc@correo.com', book_loan: 'Gran cocina -Sopas, cremas y salsas',start_date: "07/05/2022", registro_book: 1000001, estimated_date: "08/01/2022", end_date: "", status: "Prestado", dias_atradado: 7 },
    { id: 4, avatar: 4, customer_name: 'Olivia Davis', email: 'oliviad@correo.com', book_loan: 'Peregrinaciones de una paria',start_date: "09/10/2023", registro_book: 1076001, estimated_date: "08/01/2022", end_date: "", status: "Atrasado", dias_atradado: 1 },
    { id: 5, avatar: 5, customer_name: 'Mason Smith', email: 'masons@correo.com', book_loan: 'Jorge, el hijo del pueblo',start_date: "04/20/2023", registro_book: 1000001, estimated_date: "08/01/2022", end_date: "",  status: "Atrasado", dias_atradado: 3 },
    { id: 6, avatar: 6, customer_name: 'Sophia Johnson', email: 'sophiaj@correo.com', book_loan: 'En trance de Renacer. Selección de poemas', registro_book: 1000984, start_date: "01/11/2023", estimated_date: "08/01/2022", end_date: "", status: "Atrasado", dias_atradado: 0 },
    { id: 7, avatar: 7, customer_name: 'Liam Brown', email: 'liamb@correo.com', book_loan: 'Retrato de Dorian Gray',start_date: "08/07/2023", registro_book: 1034501, estimated_date: "08/01/2022", end_date: "", status: "Prestado", dias_atradado: 7 },
    { id: 8, avatar: 8, customer_name: 'Isabella Moore', email: 'isabellam@correo.com', book_loan: 'Jorge, el hijo del pueblo', registro_book: 1078901, start_date: "05/25/2022", estimated_date: "08/01/2022", end_date: "",  status: "Prestado", dias_atradado: 13 },
    { id: 9, avatar: 9, customer_name: 'Ethan Wilson', email: 'ethanw@correo.com', book_loan: 'Bertoldo, Bertoldino y Cacaseno', registro_book: 1003456, start_date: "11/09/2023", estimated_date: "08/01/2022", end_date: "12/09/2023", status: "Saldado", dias_atradado: 11 },
    { id: 10, avatar: 10, customer_name: 'Emma Taylor', email: 'emmat@correo.com', book_loan: 'El príncipe y el mendigo', registro_book: 1002455,start_date: "06/18/2023", estimated_date: "08/01/2022", end_date: "", status: "Prestado", dias_atradado: 9 }
  ],
  invoiceEmpty: false,
  invoiceError: undefined,
  invoiceLoading: false,
  invoiceValidating: false
};

export default prestamosList;