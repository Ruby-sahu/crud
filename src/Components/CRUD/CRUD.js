import React, { useState, useEffect } from "react";
import { Trash } from "react-bootstrap-icons";
import "./CRUD.css";
import Modal from "react-modal";
import { ArrowUp, ArrowDown } from 'react-bootstrap-icons';


export default function CRUD() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [patientId, setpatientId] = useState("");
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        gender: "",
    });
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState({});

    const openModal = (patient) => {
        setModalIsOpen(true);
        setpatientId(patient.id);
        setNewPatient({
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
        });
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        fetch(`https://todearhemant.pythonanywhere.com/patient/api/patients/`)
            .then((response) => response.json())
            .then((data) => {
                setPatients(data);
                console.log(data);

            });
    };
    
    
  const sorByName = (filter) =>{
    if(filter == "asn"){
        const sortedAtoZ = [...patients].sort((a, b) => a.name.localeCompare(b.name));
        setPatients(sortedAtoZ)
    }
    else{
        const sortedZtoA = [...patients].sort((a, b) => b.name.localeCompare(a.name));
        setPatients(sortedZtoA)
    }
  }

  

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (newPatient.name === "") {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (newPatient.age === "") {
            newErrors.age = "Age is required";
            isValid = false;
        }
        if (newPatient.gender === "") {
            newErrors.gender = "gender is required";
            isValid = false;
        }

        setError(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {

            // Validate the form
            if (validateForm()) {
                fetch('https://todearhemant.pythonanywhere.com/patient/api/patients/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPatient),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Success:', data);
                    });
                setNewPatient({ name: "", age: "", gender: "" });
                setIsAdding(false);
                setError({})
                    getData()
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
        }
        catch (error) {
            console.error('Error:', error)
        }
    };



    //     const addPatient = async () => {
    //         try {
    //             setIsAdding(true);
    // if(validateForm){
    //             const response = await fetch(`https://todearhemant.pythonanywhere.com/patient/api/patients/`,
    //                 {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify(newPatient),
    //                 }
    //             );

    //             if (!response.ok) {
    //                 throw new Error("Failed to add patient");
    //             }

    //             setNewPatient({ name: "", age: "", gender: "" });
    //             setIsAdding(false);
    //             setError(null);
    //             getData();
    //         }
    //         } catch (error) {
    //             setError("Please fill All Fields");
    //             setIsAdding(false);
    //         }
    //     };


    const deletePatient = async (patientId) => {
        try {
            // const response = await fetch(`https://todearhemant.pythonanywhere.com/patient/api/patients/` + patientId,
            const response = await fetch(`https://todearhemant.pythonanywhere.com/patient/api/patients/${patientId}/`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete patient");
            }
            getData();
        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };




    // const UpdatePatient = async (patientId, updatedPatient) => {
    //     try {
    //         const response = await fetch(`https://todearhemant.pythonanywhere.com/patient/api/patients/` + patientId, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(updatedPatient),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to update patient');
    //         }
    //         getData();
    //     } catch (error) {
    //         console.error('Error updating patient:', error);
    //     }
    // };
    const UpdatePatient = async (patientId) => {
        try {
            const response = await fetch(
                `https://todearhemant.pythonanywhere.com/patient/api/patients/${patientId}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newPatient),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update patient");
            }

            // setNewPatient(null);
            setNewPatient({ name: "", age: "", gender: "" });
            setModalIsOpen(false);
            getData();
        } catch (error) {
            console.error("Error updating patient:", error);
        }
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="mt-3">
                        <div className="add_patients">
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-center mb-3">Add Patient</h2>
                                {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
                                <div className="fields">
                                    <input type="text"
                                        className="form-control"
                                        value={newPatient?.name}
                                        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                        placeholder="Enter Patient Name" />
                                    {error.name && <p style={{ color: "red" }}>{error.name}</p>}

                                </div>
                                <div className="fields">
                                    <input type="text" className="form-control" value={newPatient?.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} placeholder="Patient Age" />
                                    {error.age && <p style={{ color: "red" }}>{error.age}</p>}
                                </div>
                                <div className="fields">
                                    <input type="text" className="form-control" value={newPatient?.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })} placeholder="Gender" />
                                    {error.gender && <p style={{ color: "red" }}>{error.gender}</p>}
                                </div>
                                <div className="text-center">
                                    {/* <button type="submit" className=" mt-3 addPatient_btn" onClick={addPatient} disabled={isAdding} >
                                        {isAdding ? "Adding..." : "Add Patient"}
                                    </button> */}
                                    <button type="submit" className=" mt-3 addPatient_btn">Add Patient</button>
                                </div>
                            </form>

                        </div>
                    </div>

                    <div className="mt-3">
                        <h2 className="text-center mb-3">Patient Details</h2>
                        <div className="table-responsive text-center">
                            <table className="table table-hover table-striped border">
                                <thead>
                                    <tr>
                                        <th>S.No
                                        <ArrowUp className="asc_btn" color="royalblue" onClick={() =>sorByName("asn")} />
                                        <ArrowDown className="asc_btn" color="royalblue" onClick={() => sorByName("dsn")} />
                                        </th>
                                        <th >Name 
                                        <ArrowUp className="asc_btn" color="royalblue" onClick={() =>sorByName("asn")} />
                                        <ArrowDown className="asc_btn" color="royalblue" onClick={() => sorByName("dsn")} />
                                        </th>
                                        <th>Age
                                        <ArrowUp className="asc_btn" color="royalblue" onClick={() =>sorByName("asn")} />
                                        <ArrowDown className="asc_btn" color="royalblue" onClick={() => sorByName("dsn")} />  
                                        </th>
                                        <th>Gender</th>
                                        <th>Action</th>
                                        {/* <th> <ArrowUp color="royalblue" className="arrow_space" />
                                            <ArrowDown color="royalblue" className="arrow_space" /></th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients?.map((patient) => (
                                        <tr>
                                            <td>{patient?.id}</td>
                                            <td>{patient?.name}</td>
                                            <td>{patient?.age}</td>
                                            <td>{patient?.gender}</td>
                                            <td>
                                                {/* <button onClick={() => UpdatePatient(patient.id, { name: 'UpdatedName' })} className='update_btn'>
                                                    Edit
                                                </button> */}
                                                <button onClick={() => { openModal(patient); }} className="update_btn"> Edit</button>

                                                <Trash size={20} color="red" onClick={() => deletePatient(patient.id)} className="del_btn" />

                                                {/* {/ <button onClick={() => deletePatient(patient.id)}>Delete</button> /} */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Modal
                        isOpen={modalIsOpen} className="add_patients edit_form"
                        onRequestClose={() => setModalIsOpen(false)}
                        contentLabel="Edit Patient Modal">
                        <h2 className="text-center">Edit Patient</h2>

                        <div className="modal_form ">

                            <div className="fields">
                                <input
                                    type="text" className="form-control" value={newPatient?.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} placeholder="Enter Patient Name" required />
                            </div>
                            <div className="fields">
                                <input type="text" className="form-control" value={newPatient?.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} placeholder="Patient Age" required />
                            </div>
                            <div className="fields">
                                <input
                                    type="text" className="form-control" value={newPatient?.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })} placeholder="Gender" required />
                            </div>
                            <div className="text-center">
                                <button className="addPatient_btn" onClick={() => UpdatePatient(patientId)}>
                                    Save Changes
                                </button>
                                <button className="addPatient_btn del_btn" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
}
