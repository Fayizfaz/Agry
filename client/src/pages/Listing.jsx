import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  FaSeedling,
  FaCarrot,
  FaChair,
  FaMapMarkedAlt,
  FaLeaf,
  FaEnvira,
  FaShare,
  FaCanadianMapleLeaf,
  FaHandsHelping,
  FaGlobe,
  FaCloudRain,
  FaAddressBook,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ₹{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-IN")
                : listing.regularPrice.toLocaleString("en-IN")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString("en-IN")} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaCarrot className="text-lg" />
                {listing.quantity > 1
                  ? `${listing.quantity} crop `
                  : `${listing.quantity} crop `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaSeedling className="text-lg" />
                {listing.unit > 1
                  ? `${listing.unit} Unit `
                  : `${listing.unit} Unit `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaEnvira className="text-lg" />
                {listing.nongmo ? "Non - GMO" : "Non - GMO"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaCloudRain className="text-lg" />
                {listing.nonperishable ? "Non-perishable" : "nonperishable"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={()=>setContact(true)} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing}/>}


            
          </div>
        </div>
      )}
    </main>
  );
}
