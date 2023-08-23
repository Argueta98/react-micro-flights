import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import { useAuth0 } from '@auth0/auth0-react';


function ShowFlights() {
    const dominio = "flight";
    const url = 'http://localhost:3000/api/v2/';
    const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikplc2llbDk4Iiwic3ViIjoiNjRlMmRjNTBkNzhmNGQ0YTM0ZTFlMmRhIiwiaWF0IjoxNjkyNzY3MTIwLCJleHAiOjE2OTI4MTAzMjAsImF1ZCI6Imh0dHBzOi8vc3VwZXJmbGlnaHRzLmNvbSJ9.QLfhtv9yN3xmbP8h9sGLtqKXGItnRw6mYb8BeOqkOM8";


    const [flights,setFlights] = useState([]);
    const [id,setId] = useState("");
    const [pilot,setPilot] = useState("");
    const [airplane,setAirplane] = useState("");
    const [destinationCity,setDestinationCity] = useState("");
    const [flightDate, setFlightDate]= useState("");
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState("");


    const { getIdTokenClaims } = useAuth0(); // Extraer la función getIdTokenClaims de useAuth0

    useEffect(() => {
        getFlights();
      }, []);


      const getFlights = async () => {
        try {
          const tokenGlobal = getTokenFromLocalStorage(); 
        //  const tokenGlobal = await obtenerInformacion(); // Obtener el tokenGlobal
          const response = await axios.get(url + dominio, {
            headers: {
              Authorization: token,
            },
          });
          console.log(response);
      
          setFlights(response.data);
        } catch (error) {
          console.error("Error fetching flights:", error);
          // Handle error display or any other logic...
        }
      };

      const getTokenFromLocalStorage = () => {
        const token = localStorage.getItem('access_token'); // Cambia 'access_token' por la clave que usas para guardar el token
        return token;
      };

/*      const obtenerInformacion = async () => {
        try {
          const claims = await getIdTokenClaims(); // Obtener los claims del token de acceso
          if (claims) {
            const tokenGlobal = claims.__raw; // Obtener el token de acceso
            return tokenGlobal; // Devolver el tokenGlobal
          } else {
            console.error('Los claims del token de acceso son nulos o no están definidos.');
          }
        } catch (error) {
          console.error('Error al obtener los claims del token de acceso:', error);
        }
      };*/

      const openModal = (op, id, pilot,airplane ,destinationCity,flightDate) => {
        setId('');
        setPilot('');
        setAirplane('');
        setDestinationCity('');
        setFlightDate('');
        setOperation(op);
    
        if (op === 1) {
          setTitle('REGISTRAR FLIGHT');
        }
        else if (op === 2) {
          setTitle('EDITAR FLIGHT');
          setId(id);
          setPilot(pilot);
          setAirplane(airplane);
          setDestinationCity(destinationCity);
          setFlightDate(flightDate);
        }
    
        window.setTimeout(function () {
          document.getElementById('pilot').focus();
        }, 500);
      }
//////////////////////////////////////////
      const validar = () => {
        let parametros;
        let metodo;
        if (pilot.trim() === '') {
          show_alerta('Escribe el pilot del video juego');
        }
        else if (airplane.trim() === '') {
          show_alerta('Escribe el avion del video juego');
        }
        else if (destinationCity.trim() === '') {
          show_alerta('Escribe los desarrolladores del video juego');
        }
        else if (flightDate.trim() === '') {
          show_alerta('Escribe el nombre del distribuidor del video juego');
        }
        else {
          if (operation === 1) {
            parametros = {
              pilot: pilot.trim(),
              airplane: airplane.trim(),
              destinationCity: destinationCity.trim(),
              flightDate: flightDate.trim(),
            };
            metodo = 'POST';
          }
          else {
            parametros = {
              // id:id.trim(),
              pilot: pilot.trim(),
              airplane: airplane.trim(),
              destinationCity: destinationCity.trim(),
              flightDate: flightDate.trim(),
            };
            metodo = 'PUT';
          }
    
          enviarSolicitud(metodo, parametros);
        }
      }

    //////////////////////////////////////////
    const enviarSolicitud = async (metodo, parametros) => {
     // const tokenGlobal = getTokenFromLocalStorage(); 
     // const tokenGlobal = await obtenerInformacion();
      const config = {
        method: metodo,
        url: url + dominio + "/" + id,
        data: parametros,
        headers: {
          Authorization: "Bearer " + token,
        },
      };
  
      try {
        const response = await axios(config);
        const tipo = response.data[0];
        const msj = response.data[1];
  
        Swal.fire(
          'FLIGHT AGREGADO!',
        ).then(() => {
          if (tipo === 'success') {
            document.getElementById('btnCerrar').click();
            getFlights();
          }
        });
      }
      catch (error) {
        Swal.fire({
          title: "Error en la solicitud",
          icon: "error"
        });
        console.log(error);
      }
    };
///////////////////////////
    const eliminarflights = async (id, pilot) => {
     // const tokenGlobal = getTokenFromLocalStorage(); 
     // const tokenGlobal = await obtenerInformacion();
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: '¿Seguro que quieres eliminar este vuelo: ' + pilot + '?',
        icon: 'question',
        text: 'No se podrá dar marcha atrás',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          setId(id);
          const metodo = 'DELETE';
          const parametros = { id: id.trim() };
          const config = {
            method: metodo,
            url: url + dominio + "/" + id,
            data: parametros,
            headers: {
              Authorization: "Bearer " + token,
            },
          };
          try {
            const response = await axios(config);
            const tipo = response.data[0];
            const msj = response.data[1];
            show_alerta(msj, tipo);
            if (tipo === "success") {
              document.getElementById("btnCerrar").click();
              getFlights();
            }
          } catch (error) {
            show_alerta("Error en la solicitud", "error");
            console.log(error);
          }
        } else {
          show_alerta('El vuelo NO fue eliminado', 'info');
        }
      });
    };



  return (
     <div className="App">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-4">
            <div className="d-grid mx-auto">
            <button onClick={() => openModal(1)}
                data-bs-toggle="modal"
                data-bs-target="#modalFlights" className="buttonadd">
                + Añadir Videojuego
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <table className="table striped bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>PILOT</th>
                  <th>AIRPLANE</th>
                  <th>EESTINATIONCITY</th>
                  <th>FECHA</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {flights.map((flight, i) => (
                  <tr key={flight.id}>
                    <td>{i + 1}</td>
                    <td>{flight.pilot}</td>
                    <td>{flight.airplane}</td>
                    <td>{flight.destinationCity}</td>
                    <td>{flight.flightDate}</td>
                    <td className='row-mt-3 col-2'>
                      <button onClick={() => openModal(2,
                        flight.id,
                        flight.pilot,
                        flight.airplane,
                        flight.destinationCity,
                        flight.flightDate)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#flights'>
                        <i className='fa-solid fa-edit'></i>
                      </button>
                      &nbsp;
                      <button onClick={() => eliminarflights(flight.id, flight.pilot)} className="btn btn-danger">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id='flights' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id'></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className="fa-solid fa-gamepad"></i> </span>
                <input type='text' id='pilot' className='form-control' placeholder='Pilot' value={pilot}
                  onChange={(e) => setPilot(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className="fa-regular fa-calendar-days"></i> </span>
                <input type='text' id='airplane' className='form-control' placeholder='airplane' value={airplane}
                  onChange={(e) => setAirplane(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className="fa-solid fa-code"></i></span>
                <input type='text' id='destinationCity' className='form-control' placeholder='destinationCity' value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className="fa-solid fa-building"></i> </span>
                <input type='text' id='flightDate' className='form-control' placeholder='flightDate' value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}></input>
              </div>
              
              <div className='d-grid col-4 mx-auto'>
                <button onClick={() => validar()} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i> GUARDAR
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-danger' data-bs-dismiss='modal' >Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );

}

export default ShowFlights
