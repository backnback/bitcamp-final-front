import { createContext, useContext, useEffect, useState } from 'react';

const Input = createContext();

export const useFormContext = () => useContext(Input);

export const InputProvider = ({ label, inputId, labelClassName, children, type, className, required }) => {
    return (
        <div className={`form__item form__item__input ${className ? className : ``}`}>
            {label ?
                <label htmlFor={`${inputId}`} className={`form__label__title form__label__textInput ${labelClassName != null ? labelClassName : ``}`}>
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

const Select = createContext();

export const useSelectContext = () => useContext(Select);

export const SelectProvider = ({ label, selectId, labelClassName, children, type, className, required }) => {
    return (
        <div className={`form__item form__item__select ${className ? className : ``}`}>
            {
                label ?
                    <label htmlFor={`${selectId}`} className={`form__label__title form__label__select ${labelClassName != null ? labelClassName : ``}`}>
                        {label}
                        {required ? <span className='required__red'>*</span> : ``}
                    </label > :
                    ''}
            <div className={`form__select__wrap`}>
                <Select.Provider value={type}>
                    {children}
                </Select.Provider>
            </div>
        </div>
    );
}