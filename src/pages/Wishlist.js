// src/pages/Wishlist.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useFriendsAndFamily } from "../context/FriendsAndFamilyContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { memberID } = useParams();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { getFriends } = useFriendsAndFamily();
  const [isOwnWishlist] = useState(!memberID);
  const [canViewWishlist, setCanViewWishlist] = useState(true);

  const imagesList = [
    "/assets/images/10001.avif",
    "/assets/images/10002.avif",
    "/assets/images/10003.avif",
    "/assets/images/10004.avif",
    "/assets/images/10005.avif",
    "/assets/images/10005.avif",
    "/assets/images/Action_1.avif",
    "/assets/images/Action_2.avif",
    "/assets/images/Action_3.avif",
    "/assets/images/Action_4.avif",
    "/assets/images/Action_5.avif",
    "/assets/images/Action_6.avif",
    "/assets/images/Adventure_1.avif",
    "/assets/images/Adventure_2.avif",
    "/assets/images/Adventure_3.avif",
    "/assets/images/Adventure_4.avif",
    "/assets/images/Adventure_5.avif",
    "/assets/images/Adventure_6.avif",
    "/assets/images/Fighting_1.avif",
    "/assets/images/Fighting_2.avif",
    "/assets/images/Fighting_3.avif",
    "/assets/images/Fighting_4.avif",
    "/assets/images/Fighting_5.avif",
    "/assets/images/Fighting_6.avif",
    "/assets/images/Horror_1.avif",
    "/assets/images/Horror_2.avif",
    "/assets/images/Horror_3.avif",
    "/assets/images/Horror_4.avif",
    "/assets/images/Horror_5.avif",
    "/assets/images/Horror_6.avif",
    "/assets/images/Horror_5.avif",
    "/assets/images/Puzzle_1.avif",
    "/assets/images/Puzzle_2.avif",
    "/assets/images/Puzzle_3.avif",
    "/assets/images/Puzzle_4.avif",
    "/assets/images/Puzzle_5.avif",
    "/assets/images/Puzzle_6.avif",
    "/assets/images/Racing_1.avif",
    "/assets/images/Racing_2.avif",
    "/assets/images/Racing_3.avif",
    "/assets/images/Racing_4.avif",
    "/assets/images/Racing_5.avif",
    "/assets/images/Racing_6.avif",
    "/assets/images/RPG_1.avif",
    "/assets/images/RPG_2.avif",
    "/assets/images/RPG_3.avif",
    "/assets/images/RPG_4.avif",
    "/assets/images/RPG_5.avif",
    "/assets/images/RPG_6.avif",
    "/assets/images/Simulation_1.avif",
    "/assets/images/Simulation_2.avif",
    "/assets/images/Simulation_3.avif",
    "/assets/images/Simulation_4.avif",
    "/assets/images/Simulation_5.avif",
    "/assets/images/Simulation_6.avif",
    "/assets/images/Sports_1.avif",
    "/assets/images/Sports_2.avif",
    "/assets/images/Sports_3.avif",
    "/assets/images/Sports_4.avif",
    "/assets/images/Sports_5.avif",
    "/assets/images/Sports_6.avif",
    "/assets/images/Strategy_1.avif",
    "/assets/images/Strategy_2.avif",
    "/assets/images/Strategy_3.avif",
    "/assets/images/Strategy_4.avif",
    "/assets/images/Strategy_5.avif",
    "/assets/images/Strategy_6.avif",
  ];

  useEffect(() => {
    if (memberID) {
      const friends = getFriends(1);
      const isFriend = friends.some(
        (friend) => friend.friendId === parseInt(memberID)
      );
      setCanViewWishlist(isFriend);
      if (!isFriend) {
        setCanViewWishlist(false);
      }
    }
  }, [memberID, getFriends]);

  const handleRemove = (id) => {
    if (!isOwnWishlist) {
      toast.error("You cannot remove items from someone else's wishlist.");
      return;
    }
    try {
      removeFromWishlist(id);
      //toast.success("Removed from wishlist.");
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  const handleShareWishlist = () => {
    const shareUrl = `${window.location.origin}/wishlist/${memberID || "me"}`;
    if (navigator.share) {
      navigator
        .share({
          title: "My Wishlist on GameHub",
          text: "Check out my wishlist on GameHub!",
          url: shareUrl,
        })
        .then(() => {
          toast.success("Wishlist shared successfully!");
        })
        .catch((error) => {
          toast.error("Failed to share wishlist.");
          console.error("Error sharing:", error);
        });
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast.success(
            "Wishlist link copied to clipboard. Share it with friends!"
          );
        })
        .catch(() => {
          toast.error("Failed to copy wishlist link to clipboard.");
        });
    }
  };

  if (!canViewWishlist) {
    return (
      <div className="text-center mt-10 dark:text-slate-200">
        You do not have permission to view this wishlist.
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center mt-10 dark:text-slate-200">
        This wishlist is empty.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-6 py-4 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6 dark:text-slate-100">
        {isOwnWishlist ? "Your Wishlist" : "Friend's Wishlist"}
      </h1>
      {isOwnWishlist && (
        <button
          onClick={handleShareWishlist}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Share Wishlist
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.wishListID}
            className="border rounded-lg p-4 shadow dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100"
          >
            <img
              src={
                item.game?.poster ||
                imagesList[Math.floor(Math.random() * imagesList.length)]
              }
              alt={item.game?.gameName || "Unknown Game"}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold dark:text-slate-200">
              {item.game?.gameName || "Unknown Game"}
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              ${item.game?.price || "Unknown Price"}
            </p>
            <div className="mt-4 flex justify-between">
              <Link
                to={`/products/${item.game?.id}`}
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                View Product
              </Link>
              {isOwnWishlist && (
                <button
                  onClick={() => handleRemove(item.wishListID)}
                  className="text-red-500 hover:underline dark:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
