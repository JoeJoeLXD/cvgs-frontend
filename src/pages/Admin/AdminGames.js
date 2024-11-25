// src/pages/Admin/AdminGames.js

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [deleteGame, setDeleteGame] = useState(null);

  const defaultGameState = {
    gameName: "",
    overview: "",
    price: 0,
    gameCategoryId: "",
    gameInStock: 10,
    thumbnailPath: "",
  };

  const [newGame, setNewGame] = useState(defaultGameState);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("https://localhost:7245/api/GameCategories");
      const data = await response.json();
      setCategories(data["$values"]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  }, []);

  // Fetch games
  const fetchGames = useCallback(async () => {
    try {
      const response = await fetch("https://localhost:7245/api/Games");
      const data = await response.json();
      const gamesData = data["$values"];

      // Sort games by category name, then by title
      gamesData.sort((a, b) => {
        if (a.gameCategory.name < b.gameCategory.name) return -1;
        if (a.gameCategory.name > b.gameCategory.name) return 1;
        if (a.gameName < b.gameName) return -1;
        if (a.gameName > b.gameName) return 1;
        return 0;
      });

      setGames(gamesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to fetch games");
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      await fetchCategories();
      await fetchGames();
    }
    fetchData();
  }, [fetchCategories, fetchGames]);

  const handleAddGame = async (e) => {
    e.preventDefault();

    const url = editingGame
      ? `https://localhost:7245/api/Games/${newGame.id}`
      : "https://localhost:7245/api/Games";
    const method = editingGame ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error adding/updating game:", errorText);
        toast.error("Failed to save game");
        return;
      }

      toast.success(
        editingGame ? "Game updated successfully" : "Game added successfully"
      );
      setNewGame(defaultGameState);
      fetchGames();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding/updating game:", error);
      toast.error("Failed to save game");
    }
  };

  const openAddModal = () => {
    setNewGame(defaultGameState);
    setEditingGame(null);
    setShowModal(true);
  };

  const openEditModal = (game) => {
    setNewGame({
      ...game,
      gameCategoryId: game.gameCategory?.id || "",
    });
    setEditingGame(game);
    setShowModal(true);
  };

  const openDeleteModal = (game) => {
    setDeleteGame(game);
  };

  const closeDeleteModal = () => {
    setDeleteGame(null);
  };

  const handleDeleteGame = async () => {
    if (!deleteGame) return;

    try {
      const response = await fetch(
        `https://localhost:7245/api/Games/${deleteGame.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("Failed to delete game");
        return;
      }

      toast.success("Game deleted successfully");
      fetchGames();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete game");
    }
  };

  if (loading) {
    return <div>Loading games...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl px-6 py-4 dark:bg-gray-800">
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-6 hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
        onClick={openAddModal}
      >
        Add New Game
      </button>

      <h2 className="text-2xl font-semibold mb-6 dark:text-white">Game List</h2>
      <table className="min-w-full border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-4 border text-left font-semibold dark:text-gray-300">
              Title
            </th>
            <th className="p-4 border text-left font-semibold dark:text-gray-300">
              Category
            </th>
            <th className="p-4 border text-left font-semibold dark:text-gray-300">
              Overview
            </th>
            <th className="p-4 border text-left font-semibold dark:text-gray-300">
              Price
            </th>
            <th className="p-4 border text-left font-semibold dark:text-gray-300">
              In Stock
            </th>
            <th className="p-4 border text-left font-semibold dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              key={game.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                {game.gameName}
              </td>
              <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                {game.gameCategory?.name || "Unknown"}
              </td>
              <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                {game.overview}
              </td>
              <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                ${game.price}
              </td>
              <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                {game.gamesInStock}
              </td>
              <td className="p-0 border-t-0">
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                    onClick={() => openEditModal(game)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition dark:bg-gray-400 dark:hover:bg-gray-600"
                    onClick={() => openDeleteModal(game)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteGame && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="mb-6 dark:text-gray-200">
              Are you sure you want to delete the game:{" "}
              <strong>{deleteGame.gameName}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition dark:bg-gray-600 dark:hover:bg-gray-500"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition dark:bg-red-700 dark:hover:bg-red-600"
                onClick={handleDeleteGame}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">
              {editingGame ? "Edit Game" : "Add New Game"}
            </h2>
            <form onSubmit={handleAddGame}>
              <div className="mb-4">
                <label
                  htmlFor="gameName"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Game Name
                </label>
                <input
                  type="text"
                  id="gameName"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newGame.gameName}
                  onChange={(e) =>
                    setNewGame({ ...newGame, gameName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Games In Stock Field */}
              <div className="mb-4">
                <label
                  htmlFor="gamesInStock"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Games In Stock
                </label>
                <input
                  type="number"
                  id="gamesInStock"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  min="0"
                  value={newGame.gamesInStock}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      gamesInStock: Math.max(0, parseInt(e.target.value, 10)),
                    })
                  }
                  required
                />
              </div>

              {/* Category Field */}
              <div className="mb-4">
                <label
                  htmlFor="gameCategoryId"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Category
                </label>
                <select
                  id="gameCategoryId"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newGame.gameCategoryId}
                  onChange={(e) =>
                    setNewGame({ ...newGame, gameCategoryId: e.target.value })
                  }
                  required
                >
                  <option value="" className="dark:bg-gray-700">
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="dark:bg-gray-700 dark:text-gray-100"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Overview Field */}
              <div className="mb-4">
                <label
                  htmlFor="overview"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Overview
                </label>
                <textarea
                  id="overview"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newGame.overview}
                  onChange={(e) =>
                    setNewGame({ ...newGame, overview: e.target.value })
                  }
                  required
                />
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  min="0"
                  value={newGame.price}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      price: Math.max(0, parseFloat(e.target.value)),
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition dark:bg-gray-600 dark:hover:bg-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {editingGame ? "Update Game" : "Add Game"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGames;
