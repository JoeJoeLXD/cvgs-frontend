// src/pages/Wishlist.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useFriendsAndFamily } from "../context/FriendsAndFamilyContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { memberID } = useParams(); // Get the memberID if it's available (e.g., friend's memberID)
  const { wishlist, removeFromWishlist } = useWishlist();
  const { getFriends } = useFriendsAndFamily();
  const [isOwnWishlist] = useState(!memberID);
  const [canViewWishlist, setCanViewWishlist] = useState(true);

  // List of random fallback images
  const imagesList = [
    "/assets/images/10001.avif",
    "/assets/images/10002.avif",
    "/assets/images/10003.avif",
    "/assets/images/10004.avif",
    "/assets/images/10005.avif"
  ];

  useEffect(() => {
    if (memberID) {
      // Check if memberID is in friends and family list
      const friends = getFriends(1); // Assuming logged-in memberID is 1 for simplicity
      const isFriend = friends.some((friend) => friend.friendId === parseInt(memberID));
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
      toast.success("Removed from wishlist.");
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  const handleShareWishlist = () => {
    const shareUrl = `${window.location.origin}/wishlist/${memberID || 'me'}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist on GameHub',
        text: 'Check out my wishlist on GameHub!',
        url: shareUrl,
      }).then(() => {
        toast.success("Wishlist shared successfully!");
      }).catch((error) => {
        toast.error("Failed to share wishlist.");
        console.error("Error sharing:", error);
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("Wishlist link copied to clipboard. Share it with friends!");
      }).catch(() => {
        toast.error("Failed to copy wishlist link to clipboard.");
      });
    }
  };

  if (!canViewWishlist) {
    return <div className="text-center mt-10">You do not have permission to view this wishlist.</div>;
  }

  if (wishlist.length === 0) {
    return <div className="text-center mt-10">This wishlist is empty.</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl px-0 py-4">
      <h1 className="text-3xl font-bold mb-6">
        {isOwnWishlist ? "Your Wishlist" : "Friend's Wishlist"}
      </h1>
      {isOwnWishlist && (
        <button
          onClick={handleShareWishlist}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Share Wishlist
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.wishListID} className="border rounded-lg p-4 shadow">
            <img
              src={
                item.game?.poster ||
                imagesList[Math.floor(Math.random() * imagesList.length)] // Random fallback image
              }
              alt={item.game?.gameName || "Unknown Game"}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{item.game?.gameName || "Unknown Game"}</h2>
            <p className="text-gray-600">${item.game?.price || "Unknown Price"}</p>
            <div className="mt-4 flex justify-between">
              <Link to={`/products/${item.game?.id}`} className="text-blue-500 hover:underline">
                View Product
              </Link>
              {isOwnWishlist && (
                <button
                  onClick={() => handleRemove(item.wishListID)}
                  className="text-red-500 hover:underline"
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


