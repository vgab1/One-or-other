import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Result() {
  const [username, setUsername] = useState<string | null>("");
  const [choices, setChoices] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedChoices = localStorage.getItem("choices");

    if (storedName) {
      setUsername(storedName);
    }

    if (storedChoices) {
      setChoices(JSON.parse(storedChoices));
    }

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/escolhas`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Erro ao buscar os resultados:", error);
      }
    };

    fetchResults();
  }, []);

  const handleRestart = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("choices");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-2">
        {username ? `${username} seus votos:` : "Você não forneceu um nome!"}
      </h1>
      <ul className="text-xl text-center mt-2">
        {choices.length > 0 ? (
          choices.map((choice, index) => (
            <li key={index} className="mb-2">
              {choice}
            </li>
          ))
        ) : (
          <p className="text-xl text-red-500">Você não fez nenhuma votação.</p>
        )}
      </ul>
      <button
        onClick={handleRestart}
        className="mt-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Voltar
      </button>
      <div>
        {results.map((result, index) => (
          <p key={index}>{result}</p>
        ))}
      </div>
    </div>
  );
}
