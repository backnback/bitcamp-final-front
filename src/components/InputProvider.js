import { createContext, useContext, useEffect, useState } from 'react';

const Input = createContext();

export const useFormContext = () => useContext(Input);

export const InputProvider = ({ label, inputId, labelClassName, children, type, className, required }) => {
    return (
        <div className={`form__item form__item__input ${className ? className : ``}`}>
            {label ?
                <label htmlFor={`${inputId}`} className={`form__label__textInput ${labelClassName != null ? labelClassName : ``}`}>
                    {label}
                    {required ? <span className='required__red'>*</span> : ``}
                </label> :
                ''}
            <div className={`form__input__wrap`}>
                <Input.Provider value={type}>
                    {children}
                </Input.Provider>
            </div>
        </div>
    );
}