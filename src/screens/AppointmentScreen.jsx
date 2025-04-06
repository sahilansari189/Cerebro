  import React from "react";
  import Meta from "../components/Meta";

  const AppointmentScreen = () => {
    return (
      <>
        <Meta
          title="Appointments - Cerebro"
          description="Book appointments with mental health professionals."
          keywords="appointments, mental health, professionals, booking"
        />

        <section className="min-h-screen h-auto pt-20 flex flex-col justify-center items-center">
          <div className="py-auto px-4 mx-auto text-center lg:py-8 lg:px-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:my-4 my-5 text-black">
              Book an Appointment
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Schedule a consultation with our mental health professionals using our appointment assistant.
            </p>
            
            <div className="w-full max-w-4xl h-[600px] mx-auto border border-gray-300 rounded-lg shadow-md overflow-hidden">
              <iframe
                title="Dialogflow Appointment Bot"
                width="100%"
                height="100%"
                src="https://console.dialogflow.com/api-client/demo/embedded/20436ce1-afc4-46e9-9f07-024772acdeee"
                frameBorder="0"
                allow="microphone"
                className="w-full h-full"
              ></iframe>
            </div>
            
            <div className="mt-8 text-left max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Appointment Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Appointments are available Monday through Friday, 9 AM to 5 PM</li>
                <li>Initial consultations are 30 minutes</li>
                <li>Follow-up sessions are 45-60 minutes</li>
                <li>Please provide your contact information when booking</li>
                <li>You will receive a confirmation email with meeting details</li>
              </ul>
              <p className="mt-4 text-gray-700">
                For urgent matters or special accommodations, please contact us directly at 
                <a href="mailto:support@cerebro.com" className="text-blue-600 ml-1 hover:underline">
                  support@cerebro.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </>
    );
  };

  export default AppointmentScreen; 
