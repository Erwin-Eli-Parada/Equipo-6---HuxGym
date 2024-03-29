import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import swal from "sweetalert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import BotonProducts from "../components/BotonProducts";

import { isEmpty } from "../helpers/methods";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
  Typography,
  TablePagination,
  TableFooter,
} from "@material-ui/core";
const url = "https://www.api.huxgym.codes/products/provider/";
const useStyles = (theme) => ({
  table: {
    height: "100%",
    width: "100%",
  },
  tableContainer: {
    borderRadius: 15,
    display: "flex",
    flexDireccion: "center",
    paddig: "10px 10px",
    maxWidth: "100%",
    height: "100%",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "#144983",
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    marginRight: "50px",
  },
  name: {
    fontWeight: "bold",
    color: "black",
  },
  paginacion: {
    width: "50%",
    backgroundColor: "#e9f1f3",
  },
  status: {
    fontWeight: "bold",
    fontSize: "5rem",
    color: "black",
    //backgroundColor: 'grey',
    borderRadius: 0,
    padding: "3px 10px",
    display: "inline-block",
  },
});
class TablaProvedor extends Component {
  campos = { name: "nombre", phone: "telefono" };
  state = {
    page: 0,
    rowsPerPage: 3,
    busqueda: "",
    errors: {},
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    proveedores: [],
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: "",
      apellidos:"",
      email: "",
      phone: "",
      direccion: "",
      folio:"",
    },
  };
  //PAginacion
  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };
  handleChangeRowsPerPage = async (event) => {
    console.log(event.target);
    await this.setState({
      page: 0,
      rowsPerPage: event.target.value,
    });
  };
  handleChange = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    e.persist();
    await this.setState({
      form: {
        ...this.state
          .form /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  manejadorCorreo = async () =>{
    var expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const email = this.state.form.email;
    var esValido= expReg.test(email);
    if(!esValido){
      swal({
        text: "Correo no valido",
        icon: "info",
        button: "Aceptar",
        timer: "3000",
      });
    }
  }

  peticionGet = async () => {
    try {
      const res = await axios.get(url, {
        headers: {},
      });
      console.log(res);
      this.setState({
        data: res.data,
      });
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  };

  validar = (form) => {
    if (form === null) {
      return { error: true, msj: "Rellene los campos" };
    }
    const name = form.name;
    const apellidos = form.apellidos;
    const email = form.email;
    const phone = form.phone;
    const direccion = form.direccion;
    let regex = new RegExp(
      "^[A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?$"
    );
    /* if (!regex.test(rfc)) {
      return {
        error: true,
        msj: "El campo RFC es incorrecto",
      };
    } */

    if (isEmpty(name))
      return { error: true, msj: "El campo de nombre no puede estar vacío" };
    if (isEmpty(name))
      return { error: true, msj: "El campo de apellidos no puede estar vacío" };
    if (isEmpty(email))
      return {
        error: true,
        msj: "El campo de email no puede estar vacío",
      };
    if (isEmpty(phone))
      return { error: true, msj: "El campo de telefono no puede estar vacío" };
    if (phone.length < 10)
      return { error: true, msj: "El campo de telefono debe tener 10 dígitos" };
    if (isEmpty(direccion))
      return { error: true, msj: "El campo de dirección no puede estar vacío" };
    return { error: false };
  };

  peticionPost = async () => {
    try {
      const validate = this.validar(this.state.form);
      if (validate.error) {
        swal({
          text: validate.msj,
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      } else {
        delete this.state.form.id;
        const res = await axios.post(url, this.state.form, {
          headers: {},
        });
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar();
          this.peticionGet();
          swal({
            text: "Proveedor agregado correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "4000",
          });
        }
      }
    } catch (error) {
      var msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (isEmpty(msj)) {
        const res = JSON.parse(error.request.response);
        const c = Object.keys(res)[0];
        console.log();
        msj = res[c]
          .toString()
          .replace("Este campo", "El campo " + this.campos[c]);
      }
      swal({
        text: msj, //Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      const validar = this.validar(this.state.form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      } else {
        const res = await axios.put(url + this.state.form.id, this.state.form, {
          headers: {},
        });
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          this.peticionGet();
          swal({
            text: "Proveedor actualizado correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "4000",
          });
        }
      }
    } catch (error) {
      var msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (isEmpty(msj)) {
        const res = JSON.parse(error.request.response);
        const c = Object.keys(res)[0];
        console.log();
        msj = res[c]
          .toString()
          .replace("Este campo", "El campo " + this.campos[c]);
      }
      swal({
        text: msj, //Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  peticionDelete = async () => {
    try {
      const res = await axios.delete(url + this.state.form.id, {
        headers: {},
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          modalEliminar: false,
        });
        this.peticionGet();
        swal({
          text: "Proveedor eliminado correctamente",
          icon: "success",
          button: "Aceptar",
          timer: "4000",
        });
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    this.peticionGet();
  }

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarUsuario = (proveedores) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: proveedores.id,
        name: proveedores.name,
        apellidos:proveedores.apellidos,
        email: proveedores.email,
        phone: proveedores.phone,
        direccion: proveedores.direccion,
        folio:proveedores.folio,
      },
    });
  };

  buscador = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
    console.log(this.state.busqueda);
    this.filtrarElementos();
  };

  filtrarElementos = () => {
    var i = 0;
    if (this.state.busqueda != "") {
      var search = this.state.data.filter((item) => {
        if (
          item.name.toLowerCase().includes(this.state.busqueda.toLowerCase())
        ) {
          i = 1;
          return item;
        }
      });
      this.setState({ proveedores: search });
      this.setState({ data: this.state.proveedores });
    } else {
      this.peticionGet();
    }
  };

  handleChangeInput = (e) => {
    const { name, value } = e.target;
    // let regex = new RegExp("^[a-zA-Z ]+$");
    let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");

    if (regex.test(value) || isEmpty(value)) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      e.target.value = "";
      swal({
        text: "Solo se permiten letras y acentos",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  handleChangeInputNumber = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value) || isEmpty(value)) {
      console.log(name, value);
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      swal({
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };
  /* ValidacionesRFC */

  handleChangeInputRFC = (e) => {
    const { name, value } = e.target;

    let patt = new RegExp(/[A-Za-z0-9]+/g);
    let regex = new RegExp(
      "[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ '\.\-\s\, ]+$"
    );
    /* let regex = new RegExp("^[0-9]+$"); */

    if (patt.test(value) || isEmpty(value)) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });

      if (!regex.test(value)) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            rfc: "Dirección incorrecta",
          },
        }));
      } else {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            rfc: null,
          },
        }));
      }
    } else {
      swal({
        text: "Solo se permiten numeros y letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  render() {
    const { form } = this.state;
    const { classes } = this.props;
    return (
      <div className="my-custom-scrollbar2">
        <br />
        <div className="Barra_opciones">
          <BotonProducts />
        </div>
        <br />
        <div className="opciones mt-3 mb-4">
          <button
            className="btn botones"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              this.setState({ form: null, tipoModal: "insertar" });
              this.modalInsertar();
            }}
            title="Agregar nuevo proveedor"
          >
            <AddCircleOutlineIcon fontSize="large"></AddCircleOutlineIcon>Nuevo
            Proveedor
          </button>
          <div className="buscarBox">
            <input
              type="text"
              className="textField"
              name="busqueda"
              id="busqueda"
              placeholder="Buscar"
              onChange={this.buscador}
              value={this.state.busqueda}
              title="Buscar proveedor"
            />
            <button
              type="submit"
              className="btn botonesBusqueda add-on"
              onClick={() => {}}
            >
              <i className="bx bxs-user">
                <box-icon name="search-alt-2" color="#fff"></box-icon>
              </i>
            </button>
          </div>
        </div>
        <br />
        <div className="tablaNueva">
          {this.state.data.length <= 0 ? (
            <p className="mt-4 sinClientes">Ningún proveedor encontrado</p>
          ) : (
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeaderCell}>
                      Folio
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      Nombre del Proveedor
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                    Dirección
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                    Email
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                    Télefono
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                    Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {this.state.data.slice( this.state.page * this.state.rowsPerPage,this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((proveedores) => (
                  <TableRow key={proveedores.name}>
                    <TableCell>
                    {proveedores.folio}
                    </TableCell>
                    <TableCell>
                    {proveedores.name}
                    </TableCell>
                    <TableCell>
                    {proveedores.direccion}
                    </TableCell>
                    <TableCell>
                    {proveedores.email}
                    </TableCell>
                    <TableCell>
                    {proveedores.phone}
                    </TableCell>
                    <TableCell>
                    <button
                        className="btn btn-editar"
                        onClick={() => {
                          this.seleccionarUsuario(proveedores);
                          this.modalInsertar();
                        }}
                        title='Editar proveedor'
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"  "}
                      {localStorage.getItem("rol") == "Administrador" ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.seleccionarUsuario(proveedores);
                            this.setState({ modalEliminar: true });
                          }}
                          title='Dar de baja'
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <></>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                <TablePagination
                  className={classes.paginacion}
                  rowsPerPageOptions={[3, 10, 15]}
                  //component="div"
                  count={this.state.data.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={
                              this.handleChangeRowsPerPage
                            }
              />      
                </TableFooter>
              </Table>
            </TableContainer>
          )}
        </div>
        {/* <div className="table-wrapper">
          <table className="tab-pane table">
            <thead className="tablaHeader">
              <tr className="encabezado">
                <th>Folio</th>
                <th>Nombre del proveedor</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="cuerpoTabla base">
              {this.state.data.map((proveedores) => {
                Con esto recorremos todo nuestro arreglo data para rellenar filas
                return (
                  <tr>
                    <td>{proveedores.folio}</td>
                    <td>{proveedores.name}</td>
                    <td>{proveedores.email}</td>
                    <td>{proveedores.phone}</td>
                    <td>{proveedores.direccion}</td>
                    <td>
                      <button
                        className="btn btn-editar"
                        onClick={() => {
                          this.seleccionarUsuario(proveedores);
                          this.modalInsertar();
                        }}
                        title='Editar proveedor'
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"  "}
                      {localStorage.getItem("rol") == "Administrador" ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.seleccionarUsuario(proveedores);
                            this.setState({ modalEliminar: true });
                          }}
                          title='Dar de baja'
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> */}

        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            PROVEEDOR
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {/*  {this.state.tipoModal == "insertar" ? (
                <></>
              ) : (
                <>
                  <label htmlFor="id">Id:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="id"
                    id="id"
                    readOnly
                    onChange={this.handleChange}
                    value={form ? form.id : ""}
                  />
                </>
              )} */}

              <br />
              <label htmlFor="name">Nombre del proveedor*:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                placeholder="Nombre del proveedor"
                maxLength="50"
                onChange={this.handleChangeInput}
                value={form ? form.name : ""}
              />
              <br />
              <label htmlFor="apellidos">Apellidos del proveedor*:</label>
              <input
                className="form-control"
                type="text"
                name="apellidos"
                id="apellidos"
                placeholder="Apellidos del proveedor"
                maxLength="50"
                onChange={this.handleChangeInput}
                value={form ? form.apellidos : ""}
              />
              <br />
              <label htmlFor="email">Email*:</label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                maxLength="200"
                onBlur={this.manejadorCorreo}
                onChange={this.handleChange}
                value={form ? form.email : ""}
              />
              <br />
              <label htmlFor="phone">Número de contacto*:</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                placeholder="Número de contacto"
                id="phone"
                size="10"
                maxLength="10"
                onChange={this.handleChangeInputNumber}
                value={form ? form.phone : ""}
              />
              <br />
              <label htmlFor="direccion">Dirección*:</label>
              <input
                className="form-control"
                type="text"
                name="direccion"
                id="direccion"
                size="13"
                placeholder="Dirección"
                maxLength="100"
                onChange={this.handleChangeInputRFC}
                value={form ? form.direccion : ""}
              />
              {this.state.errors.rfc && (
                <p className="errores mt-2">{this.state.errors.rfc}</p>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == "insertar" ? (
              <button
                className="btn btn-success"
                onClick={() => this.peticionPost()}
              >
                Agregar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={() => {
                this.modalInsertar();
              }}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Nombre del proveedor:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                readOnly
                onChange={this.handleChange}
                value={form ? form.name : ""}
              />
              <br />
              <label htmlFor="phone">Número de contacto:</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                readOnly
                onChange={this.handleChange}
                value={form ? form.phone : ""}
              />
              <br />
              <br />
              ¿Seguro de eliminar este proveedor?
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => this.peticionDelete()}
            >
              Sí
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(TablaProvedor);
