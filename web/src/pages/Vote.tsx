import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sorriso from "../assets/sorriso.jpg";
import Belo from "../assets/belo.jpg";
import Menos_e_mais from "../assets/menos-e-mais.jpg";
import Pericles from "../assets/pericles.jpg";
import Ferrugem from "../assets/ferrugem.jpg";
import Thiaguinho from "../assets/thiaguinho.jpg";
import Gustavo_Lima from "../assets/gusttavo-lima.jpg";
import Pixote from "../assets/pixote.jpg";
import Zeneto_Cristiano from "../assets/zeneto-e-cristiano.jpg";
import LegiaoUrbana from "../assets/legiao-urbana.jpg";

const artists = [
  { id: 1, name: "Péricles", image: Pericles },
  { id: 2, name: "Belo", image: Belo },
  { id: 3, name: "Grupo Menos é Mais", image: Menos_e_mais },
  { id: 4, name: "Pixote", image: Pixote },
  { id: 5, name: "Ferrugem", image: Ferrugem },
  { id: 6, name: "Thiaguinho", image: Thiaguinho },
  { id: 7, name: "Gusttavo Lima", image: Gustavo_Lima },
  { id: 8, name: "Zé Neto Cristiano", image: Zeneto_Cristiano },
  { id: 9, name: "Sorriso Maroto", image: Sorriso },
  { id: 10, name: "Legião Urbana", image: LegiaoUrbana },
];

export default function Vote() {
  const [username, setUsername] = useState("");
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistToConfirm, setArtistToConfirm] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");

    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleArtistClick = (artistId: number) => {
    if (artistId === 10) {
      setIsModalOpen(true);
      setArtistToConfirm(artistId);
    } else {
      setSelectedArtist(artistId);
    }
  };

  const handleVote = async () => {
    if (selectedArtist !== null) {
      const artistName =
        artists.find((artist) => artist.id === selectedArtist)?.name || "";
      const updatedChoices = [...choices, artistName];
      setChoices(updatedChoices);
      localStorage.setItem("choices", JSON.stringify(updatedChoices));

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/vote`, {
          nome: username,
          escolha: artistName,
        });
      } catch (error) {
        console.error("Erro ao salvar a escolha:", error);
      }

      if (currentPairIndex < artists.length / 2 - 1) {
        setCurrentPairIndex(currentPairIndex + 1);
        setSelectedArtist(null);
      } else {
        navigate("/result");
      }
    }
  };

  const handleConfirmVote = () => {
    setIsModalOpen(false);
    setSelectedArtist(artistToConfirm);
  };

  const handleCancelVote = () => {
    setIsModalOpen(false);
    setSelectedArtist(null);
  };

  const currentPair = artists.slice(
    currentPairIndex * 2,
    currentPairIndex * 2 + 2
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Bem-vindo, {username ? username : "visitante"}!
      </h1>
      <p className="text-lg mb-5">Escolha seu artista favorito abaixo:</p>
      <p className="text-sm mb-5">E Cuidado para não votar errado!</p>
      <div className="flex space-x-8">
        {currentPair.map((artist) => (
          <div key={artist.id} className="text-center">
            <img
              src={artist.image}
              alt={artist.name}
              onClick={() => handleArtistClick(artist.id)}
              className={`w-40 h-40 object-cover rounded-full mb-4 transition-all duration-300 cursor-pointer ${
                selectedArtist === artist.id
                  ? "border-4 border-green-500 opacity-100"
                  : selectedArtist === null
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            />
            <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
            {selectedArtist === artist.id && (
              <button
                onClick={handleVote}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Votar
              </button>
            )}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl text-center mb-4">Tem certeza???</h2>
            <p className="mb-4 text-center">No caso esse é um voto errado.</p>
            <button
              onClick={handleConfirmVote}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancelVote}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-4 hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
