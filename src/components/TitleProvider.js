import { createContext, useContext, useEffect, useState } from 'react';

const StoryTitle = createContext();

export const useStoryTitleContext = () => useContext(StoryTitle);

export const StoryTitleProvider = ({ title, selectChildren }) => {
    return (
        <div className='title__story__wrap'>
            <h2 className={`title__story`}>{title}</h2>

            {selectChildren && selectChildren}
        </div>
    );
}

const AuthTitle = createContext();

export const useAuthTitleContext = () => useContext(AuthTitle);

export const AuthTitleProvider = ({ title, children }) => {
    return (
        <div className='title__auth__wrap'>
            <h2 className={`title__auth`}>{title}</h2>

            {children}
        </div>
    );
}