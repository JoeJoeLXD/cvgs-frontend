// src/pages/Admin/AdminGames.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGame, setNewGame] = useState({ name: '', overview: '', price: '' });
  const [setEditingGame] = useState(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('https://localhost:7245/api/Games');
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error);
        toast.error('Failed to fetch games');
      }
    }
    fetchGames();
  }, []);

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7245/api/Games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGame),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error adding game:', errorText);
        toast.error('Failed to add game');
        return;
      }

      const data = await response.json();
      setGames([...games, data]);
      setNewGame({ name: '', overview: '', price: '' });
      toast.success('Game added successfully');
    } catch (error) {
      console.error('Error adding game:', error);
      toast.error('Failed to add game');
    }
  };

  if (loading) {
    return <div>Loading games...</div>;
  }

  return (
    <div>
      {/* Remove the second title here */}
      {/* <h1 className="text-2xl font-semibold my-4">Manage Games</h1> */}

      {/* Add New Game Form */}
      <form onSubmit={handleAddGame} className="mb-6">
        <h2 className="text-xl mb-4">Add New Game</h2>
        <div className="mb-4">
          <label htmlFor="gameName" className="block text-sm font-medium">Game Name</label>
          <input
            type="text"
            id="gameName"
            className="border rounded p-2 w-full"
            value={newGame.gameName}
            onChange={(e) => setNewGame({ ...newGame, gameName: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="overview" className="block text-sm font-medium">Overview</label>
          <input
            type="text"
            id="overview"
            className="border rounded p-2 w-full"
            value={newGame.overview}
            onChange={(e) => setNewGame({ ...newGame, overview: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium">Category</label>
          <input
            type="text"
            id="category"
            className="border rounded p-2 w-full"
            value={newGame.category}
            onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium">Price</label>
          <input
            type="number"
            id="price"
            className="border rounded p-2 w-full"
            value={newGame.price}
            onChange={(e) => setNewGame({ ...newGame, price: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Game
        </button>
      </form>

      {/* Games List */}
      <h2 className="text-xl mb-4">Game List</h2>
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="border border-gray-300 md:border-none block md:table-row">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Overview</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {games.map((game) => (
            <tr key={game.id} className="border border-gray-300 md:border-none block md:table-row">
              <td className="p-2">{game.gameName}</td>
              <td className="p-2">{game.category}</td>
              <td className="p-2">{game.overview}</td>       
              <td className="p-2">${game.price}</td>
              <td className="p-2 flex space-x-2">
                <button className="bg-yellow-500 text-white px-4 py-1 rounded" onClick={() => setEditingGame(game)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminGames;
