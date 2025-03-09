import React from "react";
import Meta from "../components/Meta";

const AppointmentScreen = () => {
  return (
    <>
      <Meta 
        title="Appointments - Cerebro"
        description="Book appointments with mental health professionals with ChatBot."
        keywords="appointments, mental health, professionals"
      />

      <section className="min-h-screen h-auto flex flex-col justify-center items-center">
        <div className="py-auto px-4 mx-auto  text-center lg:py-16 lg:px-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:my-4 my-5  text-black">
            Make your Appoinment Now!
          </h1>
          <div className="flex-1 overflow-y-auto p-4 border border-gray-300 rounded-lg">
            <iframe
              className="w-full h-96 border-0 rounded-lg shadow-lg overflow-hidden"
              allow="microphone;"
              src="https://console.dialogflow.com/api-client/demo/embedded/561aa08d-9bbb-4ef3-8d65-8a7e8eefccff"></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppointmentScreen;