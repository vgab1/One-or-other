import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pizza from "../assets/pizza.jpg";
import Sushi from "../assets/sushi.jpg";
import Hamburguer from "../assets/hamburguer.jpg";
import Churrasco from "../assets/churrasco.jpg";
import Coxinha from "../assets/coxinha.jpg";
import Pastel from "../assets/pastel.jpg";
import Spaghetti from "../assets/spaghetti.jpg";
import Feijoada from "../assets/feijoada.jpg";
import Pao_de_queijo from "../assets/pao-de-queijo.jpg";
import Brigadeiro from "../assets/brigadeiro.jpeg";

const artists = [
  { id: 1, name: "Pizza", image: Pizza },
  { id: 2, name: "Sushi", image: Sushi },
  { id: 3, name: "Hamburguer", image: Hamburguer },
  { id: 4, name: "Churrasco", image: Churrasco },
  { id: 5, name: "Coxinha", image: Coxinha },
  { id: 6, name: "Pastel", image: Pastel },
  { id: 7, name: "Spaghetti", image: Spaghetti },
  { id: 8, name: "Feijoada", image: Feijoada },
  { id: 9, name: "Pão de queijo", image: Pao_de_queijo },
  { id: 10, name: "Brigadeiro", image: Brigadeiro },
];

export default function Vote() {
  const [username, setUsername] = useState("");
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");

    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleArtistClick = (artistId: number) => {
    if (!isVoting) {
      setSelectedArtist(artistId);
    }
  };

  const handleVote = async () => {
    if (selectedArtist !== null && !isVoting) {
      setIsVoting(true);

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

      if (currentPairIndex < Math.ceil(artists.length / 2) - 1) {
        setTimeout(() => {
          setCurrentPairIndex(currentPairIndex + 1);
          setSelectedArtist(null);
          setIsVoting(false);
        }, 300);
      } else {
        navigate("/result");
      }
    }
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
      <p className="text-lg mb-5">Escolha sua comida favorita abaixo:</p>
      <div className="flex space-x-8">
        {currentPair.map((artist) => (
          <div key={artist.id} className="text-center">
            <img
              src={artist.image}
              alt={artist.name}
              onClick={() => handleArtistClick(artist.id)}
              className={`w-40 h-40 object-cover mb-4 transition-all duration-300 cursor-pointer ${
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
                disabled={isVoting}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Votar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
