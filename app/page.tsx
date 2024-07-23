"use client";

import axios from "axios";
import { format, formatDate, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Topbar from "./components/topbar";
import Sidebar from "./components/sidebar";

// Função para formatar CPF
const formatCPF = cpf => {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// Função para remover a formatação do CPF
const unformatCPF = cpf => {
  return cpf.replace(/\D/g, "");
};

// Componente principal Page
const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalCreatePeople, setModalCreatePeople] = useState(false);
  const [modalEditPeople, setModalEditPeople] = useState(false);
  const [modalDeletePeople, setModalDeletePeople] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [pessoas, setPessoas] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchPeoples = async () => {
    try {
      const { data } = await axios.get("http://localhost:8085/peoples");
      setPessoas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPeoples();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Topbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} />
        <div className="flex-1 flex justify-center py-4">
          <Content
            pessoas={pessoas}
            setModalCreatePeople={setModalCreatePeople}
            setModalEditPeople={setModalEditPeople}
            setModalDeletePeople={setModalDeletePeople}
            setSelectedPerson={setSelectedPerson}
          />
        </div>
      </div>
      {modalCreatePeople && (
        <CreatePeople
          onClose={() => setModalCreatePeople(false)}
          onRefresh={fetchPeoples}
        />
      )}
      {modalEditPeople && selectedPerson && (
        <EditPeople
          person={selectedPerson}
          onClose={() => setModalEditPeople(false)}
          onRefresh={fetchPeoples}
        />
      )}
      {modalDeletePeople && selectedPerson && (
        <DeletePeople
          person={selectedPerson}
          onClose={() => setModalDeletePeople(false)}
          onRefresh={fetchPeoples}
        />
      )}
    </div>
  );
};

// Componente Content
const Content = ({
  pessoas,
  setModalCreatePeople,
  setModalEditPeople,
  setModalDeletePeople,
  setSelectedPerson,
}) => {
  return (
    <div className="flex-1 p-6 bg-gray-50 w-full max-w-screen-lg mx-auto">
      <div className="flex justify-between mb-6 flex-col md:flex-row items-center">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">
          Tabela de Pessoas
        </h2>
        <button
          onClick={() => setModalCreatePeople(true)}
          className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 rounded flex items-center"
        >
          <FaPlus className="mr-2" />
          Adicionar Pessoa
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {[
                "ID",
                "Nome",
                "CPF",
                "Data de Aniversário",
                "Email",
                "Ações",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="border border-gray-300 p-3 bg-gray-100 text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pessoas.map(pessoa => (
              <tr key={pessoa.id} className="hover:bg-gray-200">
                <td className="border border-gray-300 p-3 text-center">
                  {pessoa.id}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {pessoa.name}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {pessoa.cpf}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {format(parseISO(pessoa.birthDate), "dd/MM/yyyy")}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {pessoa.email}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedPerson(pessoa);
                      setModalEditPeople(true);
                    }}
                    className="text-2xl text-yellow-600 hover:text-yellow-800 transition mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPerson(pessoa);
                      setModalDeletePeople(true);
                    }}
                    className="text-2xl text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CreatePeople = ({ onClose, onRefresh }) => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");

  const handleCreatePeople = async () => {
    try {
      await axios.post("http://localhost:8085/peoples", {
        name,
        cpf: unformatCPF(cpf), // Remover formatação do CPF
        birthDate,
        email,
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCpfChange = e => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value.replace(/\D/g, ""))) {
      setCpf(formatCPF(value));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Adicionar Pessoa</h2>
          <button onClick={onClose} className="text-red-600">
            X
          </button>
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-gray-300 p-3 mb-4"
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={handleCpfChange}
            className="border border-gray-300 p-3 mb-4"
          />
          <input
            type="date"
            placeholder="Data de Aniversário"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="border border-gray-300 p-3 mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 p-3 mb-4"
          />
          <button
            onClick={handleCreatePeople}
            className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 rounded"
          >
            Adicionar Pessoa
          </button>
        </div>
      </div>
    </div>
  );
};

const EditPeople = ({ person, onClose, onRefresh }) => {
  const [name, setName] = useState(person.name);
  const [cpf, setCpf] = useState(person.cpf);
  const [birthDate, setBirthDate] = useState(person.birthDate);
  const [email, setEmail] = useState(person.email);

  const handleEditPeople = async () => {
    try {
      await axios.put(`http://localhost:8085/peoples/${person.id}`, {
        name,
        cpf: unformatCPF(cpf), // Remover formatação do CPF
        birthDate,
        email,
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCpfChange = e => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value.replace(/\D/g, ""))) {
      setCpf(formatCPF(value));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Editar Pessoa</h2>
          <button onClick={onClose} className="text-red-600">
            X
          </button>
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-gray-300 p-3 mb-4"
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={handleCpfChange}
            className="border border-gray-300 p-3 mb-4"
          />
          <input
            type="date"
            placeholder="Data de Aniversário"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="border border-gray-300 p-3 mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 p-3 mb-4"
          />
          <button
            onClick={handleEditPeople}
            className="bg-yellow-500 text-white px-4 py-2 hover:bg-yellow-600 rounded"
          >
            Editar Pessoa
          </button>
        </div>
      </div>
    </div>
  );
};

const DeletePeople = ({ person, onClose, onRefresh }) => {
  const handleDeletePeople = async () => {
    try {
      await axios.delete(`http://localhost:8085/peoples/${person.id}`);
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Excluir Pessoa</h2>
          <button onClick={onClose} className="text-red-600">
            X
          </button>
        </div>
        <p>Tem certeza que deseja excluir {person.name}?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDeletePeople}
            className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 rounded mr-2"
          >
            Excluir
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 hover:bg-gray-400 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
