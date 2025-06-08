import React, { useState, useEffect, useRef } from 'react';
import { getZenQuote } from '../api/quoteApi';
import TaskList from './TaskList';
import WeeklyQuest from './WeeklyQuest';
import MeshGradient from 'mesh-gradient.js';
//import { useQuery } from '@apollo/client';
//import { ME } from "../utils/queries";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

const logged = Auth.getToken();

const COLORS = ["#22C96B ", "#22C9AA", "#22AAC9", "#7422C9"];

export const Home = () => {
  const navigate = useNavigate();
  const [quoteData, setQuoteData] = useState({ quote: "", author: "" });
  const [modalContent, setModalContent] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false); // State for profile modal
  const [progress, setProgress] = useState(0);

  //const { data } = useQuery(ME);

  const canvasRef = useRef(null);
  const gradient = useRef(new MeshGradient());

  const calculateProgress = () => {
    const daily = JSON.parse(localStorage.getItem('checkedTasks')) || [];
    const weekly = JSON.parse(localStorage.getItem('weeklyCheckedTasks')) || [];
    const total = daily.length + weekly.length;
    if (!total) return 0;
    const completed = daily.filter(Boolean).length + weekly.filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const updateProgress = () => {
    setProgress(calculateProgress());
  };

  useEffect(() => {
    const fetchQuote = async () => {
      const fetchedQuoteData = await getZenQuote();
      setQuoteData(fetchedQuoteData);
    };

    fetchQuote();
    updateProgress();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      gradient.current.initGradient(`#${canvasRef.current.id}`, COLORS);
      let pos = 0;
      let frame;
      const animate = () => {
        pos = (pos + 0.001) % 1000;
        gradient.current.changePosition(pos);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  useEffect(() => {
    if (!logged) {
      navigate("./login");
    }
  }, [navigate]);

  const openProfileModal = () => {
    updateProgress();
    setProfileOpen(true);
  };

  const closeProfileModal = () => {
    setProfileOpen(false);
  };

  return (
    <>
      {logged ? (
        <div className="flex flex-col w-screen min-h-screen relative">
          <canvas id="my-canvas" ref={canvasRef} className="w-full h-full absolute top-0 left-0" />
          <div className="flex flex-col lg:flex-row flex-grow relative min-h-screen overflow-hidden">
            <div className="bg-gradient-to-b from-white via-emerald-50 to-white w-full lg:w-2/12 p-4 lg:p-8 flex flex-col justify-between min-h-screen overflow-y-auto">
              <div>
                <h2 className="text-2xl lg:text-3xl mb-4 text-emerald-500 font-nexa font-bold">CalmQuest</h2>
                <button className="text-sm text-emerald-500 mt-4" onClick={openProfileModal}>Profile</button>
                <ul className="mt-8 space-y-2 text-sm">
                  <li><button className="text-emerald-600 hover:underline" onClick={() => openModal('tips')}>Calming Techniques</button></li>
                  <li><button className="text-emerald-600 hover:underline" onClick={() => openModal('support')}>Support Hotlines</button></li>
                  <li><button className="text-emerald-600 hover:underline" onClick={() => openModal('about')}>About CalmQuest</button></li>
                </ul>
              </div>
              <p>
                <a href="/login" onClick={() => Auth.logout()}>
                  Logout
                </a>
              </p>
            </div>

            <div className="w-full lg:w-10/12 p-4 lg:p-8 flex flex-col items-start justify-start overflow-y-auto">
              <div className="bg-white bg-opacity-80  rounded-lg shadow p-4 lg:p-8 w-full overflow-auto mb-6">
                <h1 className="text-2xl lg:text-4xl mb-4 text-center">Welcome to <span className="text-3xl lg:text-5xl font-nexa font-bold text-emerald-500">CalmQuest</span></h1>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="flex-1">
                    <TaskList onProgressChange={updateProgress} />
                  </div>
                  <div className="flex-1">
                    <WeeklyQuest onProgressChange={updateProgress} />
                  </div>
                </div>
              </div>
              <div className=" w-full p-4 lg:p-8 bg-opacity-80  bg-white rounded-lg shadow">
                <p className="text-xl lg:text-2xl text-center bg-gradient-to-l from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent font-nexa font-bold">Today's Inspiring Quote:</p>
                <p className="font-nexa font-ultralight text-2xl lg:text-3xl italic text-center ">
                  {quoteData.quote ? `“${quoteData.quote}” - ${quoteData.author}` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          {modalContent && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="bg-white rounded-md p-6 w-80 text-center space-y-2">
                {modalContent === 'tips' && (
                  <>
                    <h3 className="text-lg font-bold">Calming Techniques</h3>
                    <p>Try mindful breathing or light stretching when stressed.</p>
                  </>
                )}
                {modalContent === 'support' && (
                  <>
                    <h3 className="text-lg font-bold">Support Hotlines</h3>
                    <p>Call 988 for immediate help or talk with a trusted friend.</p>
                  </>
                )}
                {modalContent === 'about' && (
                  <>
                    <h3 className="text-lg font-bold">About CalmQuest</h3>
                    <p>Your companion app for daily mindfulness quests.</p>
                  </>
                )}
                <button className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded" onClick={closeModal}>Close</button>
              </div>
            </div>
          )}

          {profileOpen && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-sm bg-opacity-50">
            <div className="fixed top-[50%] left-[50%] w-72 h-72 bg-white rounded-md flex flex-col items-center justify-between p-4 shadow-lg transform translate-x-[-50%] translate-y-[-50%]">
              <h3 className="mb-4 text-lg font-nexa font-ultralight">Profile</h3>
              <div className="w-full h-2 bg-gray-300 rounded">
                <div className="h-full bg-green-500 rounded" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="mt-2">Task Progress: {progress}%</p>
              <p>Name: {Auth.getProfile()?.data?.name || 'User'}</p>
              <button
                className="bg-green-500 text-white rounded-md px-4 py-2 mt-4"
                onClick={closeProfileModal}
              >
                Close
              </button>
            </div>
          </div>
          )}
        </div>
      ) : null}
    </>
  );
};