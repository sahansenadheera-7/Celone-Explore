import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    MapPin,
    X,
    Plus,
    Save,
    ChevronDown,
} from "lucide-react";

import {
    createAttraction,
    updateAttraction,
} from "../../services/attractionService";


const emptyForm = {
    name: "",
    category: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    mainImageUrl: "",
    imageUrls: [],
};


const categories = [
    "Cultural Heritage",
    "Nature",
    "Historical Site",
    "Beach",
];


// Sri Lanka default location
const DEFAULT_LOCATION = {
    lat: 7.8731,
    lng: 80.7718,
};


export default function AddAttractionModal({
    isOpen,
    onClose,
    attraction,
    onSaved,
}) {

    const [formData, setFormData] =
        useState(emptyForm);

    const [imageInput, setImageInput] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [mapLoaded, setMapLoaded] =
        useState(false);


    const mapRef = useRef(null);

    const mapInstanceRef = useRef(null);

    const markerRef = useRef(null);


    const isEdit =
        Boolean(attraction);


    // ======================================================
    // Load Google Maps script
    // ======================================================

    useEffect(() => {

        if (!isOpen)
            return;


        const apiKey =
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


        if (!apiKey) {

            setError(
                "Google Maps API key is missing. Check your .env file."
            );

            return;
        }


        // Already loaded
        if (
            window.google &&
            window.google.maps
        ) {

            setMapLoaded(true);

            return;
        }


        const existingScript =
            document.querySelector(
                'script[src*="maps.googleapis.com/maps/api/js"]'
            );


        if (existingScript) {

            existingScript.addEventListener(
                "load",
                () => setMapLoaded(true)
            );

            return;
        }


        const script =
            document.createElement("script");


        script.src =
            `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;


        script.async = true;

        script.defer = true;


        script.onload = () => {

            setMapLoaded(true);

        };


        script.onerror = () => {

            setError(
                "Failed to load Google Maps. Check your API key and Google Cloud settings."
            );

        };


        document.head.appendChild(script);


    }, [isOpen]);


    // ======================================================
    // Load edit data
    // ======================================================

    useEffect(() => {

        if (attraction) {

            setFormData({

                name:
                    attraction.name || "",

                category:
                    attraction.category || "",

                address:
                    attraction.address || "",

                description:
                    attraction.description || "",

                latitude:
                    attraction.latitude ?? "",

                longitude:
                    attraction.longitude ?? "",

                mainImageUrl:
                    attraction.mainImageUrl || "",

                imageUrls:
                    attraction.imageUrls || [],

            });

        } else {

            setFormData({
                ...emptyForm,
            });

        }

        setError("");

    }, [attraction, isOpen]);


    // ======================================================
    // Initialize map
    // ======================================================

    useEffect(() => {

        if (
            !isOpen ||
            !mapLoaded ||
            !mapRef.current
        ) {
            return;
        }


        let latitude =
            Number(formData.latitude);

        let longitude =
            Number(formData.longitude);


        if (
            Number.isNaN(latitude) ||
            Number.isNaN(longitude)
        ) {

            latitude =
                DEFAULT_LOCATION.lat;

            longitude =
                DEFAULT_LOCATION.lng;
        }


        const position = {
            lat: latitude,
            lng: longitude,
        };


        // Create map
        if (!mapInstanceRef.current) {

            mapInstanceRef.current =
                new window.google.maps.Map(
                    mapRef.current,
                    {
                        center: position,
                        zoom: attraction
                            ? 15
                            : 8,

                        mapTypeControl: true,
                        streetViewControl: false,
                        fullscreenControl: true,
                        zoomControl: true,
                    }
                );


            // Create marker
            markerRef.current =
                new window.google.maps.Marker({
                    position,
                    map: mapInstanceRef.current,
                    draggable: true,
                    title: "Attraction Location",
                });


            // Map click
            mapInstanceRef.current.addListener(
                "click",
                (event) => {

                    if (
                        !event.latLng
                    ) {
                        return;
                    }


                    const lat =
                        event.latLng.lat();

                    const lng =
                        event.latLng.lng();


                    updateLocation(
                        lat,
                        lng
                    );

                }
            );


            // Marker drag
            markerRef.current.addListener(
                "dragend",
                (event) => {

                    if (
                        !event.latLng
                    ) {
                        return;
                    }


                    const lat =
                        event.latLng.lat();

                    const lng =
                        event.latLng.lng();


                    updateLocation(
                        lat,
                        lng
                    );

                }
            );

        } else {

            mapInstanceRef.current.setCenter(
                position
            );

            markerRef.current.setPosition(
                position
            );

        }


    }, [
        isOpen,
        mapLoaded,
        attraction,
    ]);


    // ======================================================
    // Update location
    // ======================================================

    const updateLocation = (
        latitude,
        longitude
    ) => {

        setFormData((prev) => ({
            ...prev,

            latitude:
                latitude.toFixed(6),

            longitude:
                longitude.toFixed(6),
        }));


        if (
            markerRef.current
        ) {

            markerRef.current.setPosition({
                lat: latitude,
                lng: longitude,
            });

        }


        if (
            mapInstanceRef.current
        ) {

            mapInstanceRef.current.panTo({
                lat: latitude,
                lng: longitude,
            });

        }

    };


    // ======================================================
    // Input change
    // ======================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));


        // Update marker when coordinates
        // are manually changed

        if (
            name === "latitude" ||
            name === "longitude"
        ) {

            const latitude =
                name === "latitude"
                    ? Number(value)
                    : Number(formData.latitude);

            const longitude =
                name === "longitude"
                    ? Number(value)
                    : Number(formData.longitude);


            if (
                !Number.isNaN(latitude) &&
                !Number.isNaN(longitude) &&
                latitude >= -90 &&
                latitude <= 90 &&
                longitude >= -180 &&
                longitude <= 180
            ) {

                updateLocation(
                    latitude,
                    longitude
                );
            }
        }

    };


    // ======================================================
    // Add image
    // ======================================================

    const addImage = () => {

        const url =
            imageInput.trim();


        if (!url)
            return;


        if (
            formData.imageUrls.length >= 5
        ) {

            setError(
                "Maximum 5 additional images allowed."
            );

            return;
        }


        if (
            formData.imageUrls.includes(url)
        ) {

            setError(
                "This image has already been added."
            );

            return;
        }


        setFormData((prev) => ({
            ...prev,

            imageUrls: [
                ...prev.imageUrls,
                url,
            ],
        }));


        setImageInput("");

        setError("");
    };


    // ======================================================
    // Remove image
    // ======================================================

    const removeImage = (index) => {

        setFormData((prev) => ({
            ...prev,

            imageUrls:
                prev.imageUrls.filter(
                    (_, i) =>
                        i !== index
                ),
        }));
    };


    // ======================================================
    // Submit
    // ======================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!formData.name.trim()) {

            setError(
                "Attraction name is required."
            );

            return;
        }


        if (!formData.category) {

            setError(
                "Category is required."
            );

            return;
        }


        if (!formData.address.trim()) {

            setError(
                "Address is required."
            );

            return;
        }


        if (!formData.description.trim()) {

            setError(
                "Description is required."
            );

            return;
        }


        if (!formData.mainImageUrl.trim()) {

            setError(
                "Main image URL is required."
            );

            return;
        }


        const latitude =
            Number(formData.latitude);

        const longitude =
            Number(formData.longitude);


        if (
            Number.isNaN(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {

            setError(
                "Enter a valid latitude."
            );

            return;
        }


        if (
            Number.isNaN(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {

            setError(
                "Enter a valid longitude."
            );

            return;
        }


        const payload = {

            name:
                formData.name.trim(),

            category:
                formData.category,

            address:
                formData.address.trim(),

            description:
                formData.description.trim(),

            latitude,

            longitude,

            mainImageUrl:
                formData.mainImageUrl.trim(),

            imageUrls:
                formData.imageUrls,

        };


        try {

            setSaving(true);


            if (isEdit) {

                await updateAttraction(
                    attraction.id,
                    {
                        ...payload,

                        isActive:
                            attraction.isActive,
                    }
                );

            } else {

                await createAttraction(
                    payload
                );
            }


            onSaved();

        } catch (err) {

            setError(
                err.message ||
                "Failed to save attraction."
            );

        } finally {

            setSaving(false);
        }

    };


    // ======================================================
    // Close
    // ======================================================

    const handleClose = () => {

        // Clean map
        if (markerRef.current) {

            markerRef.current.setMap(
                null
            );

        }

        markerRef.current = null;

        mapInstanceRef.current = null;

        onClose();

    };


    if (!isOpen)
        return null;


    return (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-5 border-b">

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">

                            {isEdit
                                ? "Edit Attraction"
                                : "Add Attraction"}

                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                            Add attraction details and select its location on the map.

                        </p>

                    </div>


                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                    >

                        <X size={20} />

                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6"
                >

                    {/* Error */}

                    {error && (

                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">

                            {error}

                        </div>

                    )}


                    {/* Name */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Name *
                        </label>

                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter attraction name"
                            className="w-full px-4 py-2.5 border rounded-lg"
                        />

                    </div>


                    {/* Category + Address */}

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="block text-sm font-medium mb-1">
                                Category *
                            </label>

                            <div className="relative">

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border rounded-lg appearance-none bg-white"
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>

                                        )
                                    )}

                                </select>

                                <ChevronDown
                                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                    size={16}
                                />

                            </div>

                        </div>


                        <div>

                            <label className="block text-sm font-medium mb-1">
                                Address / Location *
                            </label>

                            <div className="relative">

                                <MapPin
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={16}
                                />

                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter location"
                                    className="w-full pl-9 pr-4 py-2.5 border rounded-lg"
                                />

                            </div>

                        </div>

                    </div>


                    {/* Description */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Description *
                        </label>

                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter attraction description"
                            className="w-full px-4 py-2.5 border rounded-lg resize-y"
                        />

                    </div>


                    {/* ==================================================
                        GOOGLE MAP
                    ================================================== */}

                    <div className="border rounded-xl overflow-hidden">

                        <div className="px-4 py-3 bg-slate-50 border-b">

                            <div className="flex items-center gap-2">

                                <MapPin
                                    size={18}
                                    className="text-teal-700"
                                />

                                <div>

                                    <h3 className="font-semibold text-sm text-slate-900">
                                        Select Attraction Location
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Click on the map or drag the marker to select the exact location.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {!mapLoaded ? (

                            <div className="h-[380px] flex items-center justify-center bg-slate-100">

                                <div className="text-center">

                                    <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />

                                    <p className="text-sm text-slate-500">
                                        Loading Google Maps...
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div
                                ref={mapRef}
                                className="w-full h-[380px]"
                            />

                        )}

                    </div>


                    {/* Coordinates */}

                    <div className="border rounded-xl p-4 bg-slate-50">

                        <h3 className="font-semibold text-sm mb-4">
                            Coordinates
                        </h3>


                        <div className="grid md:grid-cols-2 gap-5">

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Latitude *
                                </label>

                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    placeholder="7.9574"
                                    className="w-full px-4 py-2.5 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Longitude *
                                </label>

                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    placeholder="80.7606"
                                    className="w-full px-4 py-2.5 border rounded-lg"
                                />

                            </div>

                        </div>


                        <p className="text-xs text-slate-500 mt-3">

                            💡 You can click the map, drag the marker, or enter coordinates manually.

                        </p>

                    </div>


                    {/* Main image */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Main Image URL *
                        </label>

                        <input
                            name="mainImageUrl"
                            value={formData.mainImageUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full px-4 py-2.5 border rounded-lg"
                        />

                        {formData.mainImageUrl && (

                            <img
                                src={formData.mainImageUrl}
                                alt="Preview"
                                className="mt-3 w-48 h-28 object-cover rounded-lg border"
                            />

                        )}

                    </div>


                    {/* Additional images */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Other Images
                        </label>

                        <div className="flex gap-2">

                            <input
                                value={imageInput}
                                onChange={(e) =>
                                    setImageInput(
                                        e.target.value
                                    )
                                }
                                placeholder="Image URL"
                                className="flex-1 px-4 py-2.5 border rounded-lg"
                            />

                            <button
                                type="button"
                                onClick={addImage}
                                className="px-4 bg-slate-100 border rounded-lg flex items-center gap-1"
                            >

                                <Plus size={16} />

                                Add

                            </button>

                        </div>


                        <div className="flex flex-wrap gap-3 mt-4">

                            {formData.imageUrls.map(
                                (url, index) => (

                                    <div
                                        key={`${url}-${index}`}
                                        className="relative"
                                    >

                                        <img
                                            src={url}
                                            alt=""
                                            className="w-24 h-20 object-cover rounded-lg border"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(index)
                                            }
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                        >

                                            <X size={12} />

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* Buttons */}

                    <div className="flex justify-end gap-3 pt-3">

                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 border rounded-lg"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >

                            <Save size={16} />

                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Update Attraction"
                                    : "Save Attraction"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}