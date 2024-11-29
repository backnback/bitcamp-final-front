import { useEffect, useState } from 'react';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import { SelectProvider } from '../components/SelectProvider.js';


export const SearchProvider = (
    { handleSearchSubmit, handleOptionChange, searchQuery, handleSearchChange, handleSearchDelete }) => {

    return (
        <div className='search__wrap'>
            <form className="search__form" onSubmit={handleSearchSubmit}>
                <div className='search__form__wrap'>
                    <div className={`search__form__item search__form__item__select`}>
                        <SelectProvider>
                            <select id="search-select" name="검색어" className={`form__select form__select__search`}
                                title='검색' onChange={handleOptionChange}>
                                <option value={'0'}>제목</option>
                                <option value={'1'}>닉네임</option>
                                <option value={'2'}>지역</option>
                            </select>
                        </SelectProvider>
                    </div>

                    <div className={`search__form__item search__form__item__input`}>
                        <InputProvider>
                            <input
                                type='text'
                                className={`form__input form__input__search`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                required
                                id='text01'
                                name='검색'
                                placeholder="검색" />
                        </InputProvider>

                        <div className={`search__input__item__button`}>
                            {searchQuery && <ButtonProvider width={'icon'} className={`button__item__x`}>
                                <button type="button" className={`button button__icon button__icon__x`} onClick={handleSearchDelete}>
                                    <span className={`blind`}>삭제</span>
                                    <i className={`icon icon__x__black`}></i>
                                </button>
                            </ButtonProvider>}

                            <ButtonProvider width={'icon'} className={`button__item__search`}>
                                <button type="button" className={`button button__icon button__icon__search`} onClick={handleSearchSubmit}>
                                    <span className={`blind`}>검색</span>
                                    <i className={`icon__search`}></i>
                                </button>
                            </ButtonProvider>
                        </div>

                    </div>
                </div>
            </form>
        </div>

    );
}

export default SearchProvider;