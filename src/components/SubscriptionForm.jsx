"use client"

import { addSubscription } from "@/actions/actions";
import { useState } from "react";

export default function SubscriptionForm() {
    const [isPending, setIsPending] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [formValues, setFormValues] = useState({
        email: "",
        firstName: "",
        lastName: ""
    });

    const handleSubscription = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setSubmitError("");
        setSubmitSuccess("");
        
        try {
            const formData = new FormData(e.target);
            const res = await addSubscription(formData);
            
            if (res.successMessage) {
                setSubmitSuccess(res.successMessage);
                setFormValues({ email: "", firstName: "", lastName: "" }); // Reset form
            } else {
                setSubmitError(res.errorMessage || "An unknown error occurred");
            }
        } catch (error) {
            setSubmitError("Failed to process subscription. Please try again.");
            console.error("Subscription error:", error);
        } finally {
            setIsPending(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            {submitSuccess && (
                <div className="w-[90%] max-w-[370px] mx-auto px-8 py-6 space-y-4 rounded text-white border border-green-500">
                    {submitSuccess}
                </div>
            )}
            {submitError && (
                <div className="w-[90%] max-w-[370px] mx-auto px-8 py-6 space-y-4 rounded text-white border border-red-500">
                    {submitError}
                </div>
            )}
            {!submitSuccess && !submitError && (
                <form className="space-y-4" onSubmit={handleSubscription}>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        className="p-4 text-gray-600 bg-transparent border border-gray-200/20 rounded-full w-full" 
                        placeholder="Enter email"
                        required
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <input 
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formValues.firstName}
                            onChange={handleChange}
                            className="p-4 text-gray-600 bg-transparent border border-gray-200/20 rounded-full w-full" 
                            placeholder="First name"
                            required
                        />
                        <input 
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formValues.lastName}
                            onChange={handleChange}
                            className="p-4 text-gray-600 bg-transparent border border-gray-200/20 rounded-full w-full" 
                            placeholder="Last name"
                        />
                    </div>
                    <button 
                        disabled={isPending}
                        className="bg-gray-400 text-cyan-800 px-4 py-2 rounded-full hover:bg-gray-500 transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Processing..." : "Subscribe"}
                    </button>
                </form>
            )}
        </>
    );
}