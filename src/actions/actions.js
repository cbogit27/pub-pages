"use server"

const googleScriptURL = process.env.GOOGLE_URL;

export const addSubscription = async (formData) => {
    if (!googleScriptURL) {
        console.error("GOOGLE_URL environment variable is not set");
        return { errorMessage: "Server configuration error" };
    }

    const email = formData.get("email")?.toString() || "";
    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";

    // Basic validation
    if (!email || !email.includes("@") || !email.includes(".")) {
        return { errorMessage: "Please enter a valid email address" };
    }

    try {
        const res = await fetch(googleScriptURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event: "subscription to newsletter",
                email,
                firstName,
                lastName,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Google Script Error:", errorText);
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const responseData = await res.text();
        console.log("Google Script Response:", responseData);

        return { 
            successMessage: "Success! You've been subscribed to our newsletter!" 
        };

    } catch (error) {
        console.error("Subscription Error:", error);
        return { 
            errorMessage: "Oops! We couldn't complete your subscription. Please try again later." 
        };
    }
};