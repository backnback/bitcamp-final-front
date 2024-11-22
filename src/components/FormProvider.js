import { createContext, useContext, useEffect, useState } from 'react';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import { SelectProvider } from '../components/SelectProvider.js';
import { PhotosProvider } from '../components/PhotosProvider';
import styles from '../assets/styles/css/StoryAddForm.module.css';
import FormFileIcon from "../components/FormFileIcon";


const FormContext = createContext();


export const useFormContext = () => useContext(FormContext);


export const FormProvider = ({ children, value }) => {
    return (
        <FormContext.Provider value={value}>
            {children}
        </FormContext.Provider>
    );
};


export const StoryForm = () => {
    const {
        title, setTitle,
        selectedYear, setSelectedYear,
        selectedMonth, setSelectedMonth,
        selectedDay, setSelectedDay,
        selectedFirstName, setSelectedFirstName, firstNames,
        selectedSecondName, setSelectedSecondName, secondNames,
        locationDetail, setLocationDetail,
        handleFileChange,
        content, setContent,
        checkedShare, handleCheckboxChange,
        files, onAddPhoto, onDeletePhoto,
        mainPhotoIndex, handleMainPhotoSelect,
        handleButtonClick,
        handleSubmit
    } = useFormContext();


    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form_box}>
                <div className={styles.title__box}>
                    <h5 className={styles.title__text}>제목</h5>
                    <InputProvider>
                        <input
                            type='text'
                            className={`form__input`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            id='text01'
                            name='텍수투'
                            placeholder="title" />
                    </InputProvider>
                </div>
                <div>
                    <h5>날짜</h5>
                    <div className={styles.date__box}>
                        <SelectProvider>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                id="select01" name="selectYear" className={`form__select`}>
                                <option value={'0'}>년</option>
                                {[...Array(10)].map((_, index) => {
                                    const year = new Date().getFullYear() - index;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </SelectProvider>
                        <p className={styles.date__text}>년</p>
                        <SelectProvider>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                id="select02" name="selectMonth" className={`form__select`}>
                                <option value={'0'}>달</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                        </SelectProvider>
                        <p className={styles.date__text}>월</p>
                        <SelectProvider>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(Number(e.target.value))}
                                id="select03" name="selectDay" className={`form__select`}>
                                <option value={'0'}>일</option>
                                {[...Array(31)].map((_, index) => {
                                    const day = index + 1;
                                    return <option key={day} value={day}>{day}</option>;
                                })}
                            </select>
                        </SelectProvider>
                        <p className={styles.date__text}>일</p>
                    </div>
                </div>
                <div className={styles.location__box}>
                    <h5>지역</h5>
                    <div className={styles.location__picker__box}>
                        <SelectProvider className={styles.location__picker__province}>
                            <select id="select04" name="selectFirstName" className={`form__select`}
                                onChange={(e) => setSelectedFirstName(e.target.value)} value={selectedFirstName}>
                                <option value={'0'}>지역 선택</option>
                                {firstNames.map((firstName) => (
                                    <option key={firstName} value={firstName}>
                                        {firstName}
                                    </option>
                                ))}
                            </select>
                        </SelectProvider>
                        <SelectProvider>
                            <select id="select05" name="selectSecondName" className={`form__select`}
                                onChange={(e) => setSelectedSecondName(e.target.value)} value={selectedSecondName}
                                disabled={!selectedFirstName}>
                                <option value={'0'}>세부 지역 선택</option>
                                {secondNames.map((location) => (
                                    <option key={location.id} value={location.secondName}>
                                        {location.secondName}
                                    </option>
                                ))}
                            </select>
                        </SelectProvider>
                    </div>
                    <InputProvider>
                        <input
                            type='text'
                            className={`form__input`}
                            value={locationDetail}
                            onChange={(e) => setLocationDetail(e.target.value)}
                            required
                            id='text02'
                            name='텍수투'
                            placeholder="지역 상세정보 입력" />
                    </InputProvider>
                </div>
                <div className={styles.photo__box}>
                    {files.length === 0 ? (
                        <InputProvider>
                            <label htmlFor="file01" className="form__label form__label__file">
                                <input type="file" className="blind" id="file01" multiple onChange={handleFileChange} />
                                <FormFileIcon />
                            </label>
                        </InputProvider>
                    ) : (
                        <PhotosProvider
                            photos={files}
                            viewMode={false}
                            className="custom-photo-container"
                            mainPhotoIndex={mainPhotoIndex}
                            onSelectMainPhoto={handleMainPhotoSelect}
                            onAddPhoto={onAddPhoto}
                            onDeletePhoto={onDeletePhoto}
                        />
                    )}
                </div>
                <div className={styles.content__box}>
                    <h5>내용</h5>
                    <InputProvider className={styles.content__inputBox}>
                        <textarea
                            id='textarea01'
                            placeholder='내용 입력'
                            className={`form__textarea`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </InputProvider>
                </div>

                <InputProvider className={styles.share__check__box}>
                    <label htmlFor="checkbox01" className={`form__label form__label__checkbox`}>
                        <input
                            type='checkbox'
                            className={`form__input`}
                            defaultChecked={checkedShare}
                            id='checkbox01'
                            name='체크체크'
                            onChange={handleCheckboxChange}
                        />
                        <span className={`input__text`}>해당 스토리를 공개합니다.</span>
                    </label>
                </InputProvider>

                <ButtonProvider className={styles.save__button__box}>
                    <button type="button" id="submit-button" className={`button button__primary`}
                        onClick={handleButtonClick}>
                        <span className={`button__text`}>등록</span>
                    </button>
                </ButtonProvider>
            </form>
        </div>
    );
}
