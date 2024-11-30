import { createContext, useContext, useEffect, useState } from 'react';
import { InputProvider, SelectProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import { PhotosProvider } from '../components/PhotosProvider';
import FormFileIcon from "../components/FormFileIcon";
import styles from "../assets/styles/css/StoryAddForm.module.css";


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
        handleSubmit,
    } = useFormContext();

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form_box}>
                <InputProvider label={`제목`} inputId={`title01`} required={true}>
                    <input
                        value={title}
                        id='title01'
                        className={`form__input`}
                        name='제목'
                        placeholder='제목 입력'
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    {title.length >= 30 && <span className={`sub__notice sub__notice__danger`}>{`제목을 30자 이하로 입력해주세요.`}</span>}
                </InputProvider>

                <SelectProvider label={`날짜`} required={true}>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        id="selectYear" name="selectYear" className={`form__select`}>
                        <option value={'0'}>년</option>
                        {[...Array(10)].map((_, index) => {
                            const year = new Date().getFullYear() - index;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                    <span>년</span>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        id="selectMonth" name="selectMonth" className={`form__select`}>
                        <option value={'0'}>달</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <span>월</span>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                        id="selectDay" name="selectDay" className={`form__select`}>
                        <option value={'0'}>일</option>
                        {[...Array(31)].map((_, index) => {
                            const day = index + 1;
                            return <option key={day} value={day}>{day}</option>;
                        })}
                    </select>
                    <span>일</span>
                </SelectProvider>
                <div className={`form__item__wrap`}>
                    <SelectProvider label={`지역`} required={true}>
                        <select id="selectFirstName" name="selectFirstName" className={`form__select`}
                            onChange={(e) => setSelectedFirstName(e.target.value)} value={selectedFirstName}>
                            <option value={'0'}>지역 선택</option>
                            {firstNames.map((firstName) => (
                                <option key={firstName} value={firstName}>
                                    {firstName}
                                </option>
                            ))}
                        </select>
                        <select id="selectSecondName" name="selectSecondName" className={`form__select`}
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
                    <InputProvider>
                        <input
                            type='text'
                            className={`form__input`}
                            value={locationDetail}
                            onChange={(e) => setLocationDetail(e.target.value)}
                            id='locationName01'
                            name='locationName'
                            placeholder="지역 상세정보 입력" />
                        {locationDetail.length >= 30 && <span className={`sub__notice sub__notice__danger`}>{`지역 상세정보를 30자 이하로 입력해주세요.`}</span>}
                    </InputProvider>
                </div>
                <div className={`${styles.photo__box} form__item__wrap`}>
                    <h5 className='form__label__title'>사진 등록<span className='required__red'>*</span></h5>
                    {
                        files.length === 0 ? (
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
                <InputProvider label={`내용`} htmlFor='storyContent' required={true}>
                    <textarea
                        id='storyContent'
                        placeholder='내용 입력'
                        className={`form__textarea`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </InputProvider>

                <div className={styles.share__check__box}>
                    <InputProvider>
                        <label htmlFor="storyLock" className={`form__label form__label__checkbox`}>
                            <input
                                type='checkbox'
                                className={`form__input`}
                                defaultChecked={checkedShare}
                                id='storyLock'
                                name='storyLock'
                                onChange={handleCheckboxChange}
                            />
                            <span className={`input__text`}>해당 스토리를 공개합니다.</span>
                        </label>
                    </InputProvider>
                </div>
            </form>
        </div>
    );
}
