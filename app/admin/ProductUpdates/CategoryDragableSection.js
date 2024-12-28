import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useCallback } from 'react';
import './table.modules.css'
import debounce from 'lodash.debounce';

const CategoryDraggableSession = ({ session, moveSession, setUpdateSessionPopup, setSessionData , setIsDeleteSessionModalOpen , setSessionToDelete }) => {
    const [, drop] = useDrop({
        accept: "SESSION",
        hover: debounce((item) => {
            if (item.id !== session._id) {
                moveSession(item.id, session._id);
                item.id = session._id;
            }
        }, 100),
    });

    const [{ isDragging }, drag] = useDrag({
        type: "SESSION",
        item: { id: session._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });


    return (
        <div
            ref={(node) => drag(drop(node))}
            className={`p-4 border rounded-lg sm:w-1/2 w-full cursor-grab  shadow-md mb-6 transition-transform transform ${isDragging ? "opacity-50" : ""
                }`}
        >
            {/* Content */}
            <div className="flex flex-col space-y-4">
               <spancl className='font-bold'>Popularity: {session.popularity}</spancl>
            </div>
            <div className="flex flex-col space-y-4">
                {/* Video */}
                {session.video && (
                    <video className="w-full py-4 h-auto rounded-lg" src={session.video} controls />
                )}
                {/* Image */}
                {session.image && (
                    <img className="w-full py-4 h-auto rounded-lg" src={session.image} alt="session" />
                )}
                {/* Description */}
                {session.desc && <span  className=" prose py-4 text-lg" dangerouslySetInnerHTML={{ __html: session.desc }} />}
                {/* Audio */}
                {session.audio && (
                    <audio className="w-full py-4 " src={session.audio} controls />
                )}
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
                <button
                    title="Edit Section"
                    className="text-purple-600 hover:text-purple-800"

                    onClick={() => {
                        setSessionData(session);
                        setUpdateSessionPopup(true);
                    }}
                >
                    <FiEdit />
                </button>
                <button
                    title="Delete"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                        setSessionToDelete(session);
                        setIsDeleteSessionModalOpen(true);
                    }}
                >
                    <FiTrash />
                </button>
            </div>
        </div>
    );
};


export default CategoryDraggableSession;
