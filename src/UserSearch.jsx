

import { useState, useEffect, useRef } from 'react';

export default function UserSearch() {
    const [
        query,
        setQuery,
    ] = useState( '' );
    const [
        filteredUsers,
        setFilteredUsers,
    ] = useState( [] );
    const [
        selectedUser,
        setSelectedUser,
    ] = useState( null );
    const [
        isLoading,
        setIsLoading,
    ] = useState( false );
    const [
        isDropdownOpen,
        setIsDropdownOpen,
    ] = useState( false );
    const [
        highlightedIndex,
        setHighlightedIndex,
    ] = useState( 0 );
    const inputRef = useRef( null );

    useEffect( () => {
        if ( query.length < 2 ) {
            setFilteredUsers( [] );
            setIsDropdownOpen( false );

            return;
        }

        setIsLoading( true );

        fetch( 'https://jsonplaceholder.typicode.com/users' )
            .then( ( res ) => res.json() )
            .then( ( data ) => {
                const filtered = data.filter( ( user ) => user.name.toLowerCase()
                    .includes( query.toLowerCase() ) );

                setFilteredUsers( filtered );
                setIsDropdownOpen( true );
                setIsLoading( false );
            } );
    }, [ query ] );

    useEffect( () => {
        const handleClickOutside = ( e ) => {
            if ( inputRef.current && ! inputRef.current.contains( e.target ) ) {
                setIsDropdownOpen( false );
            }
        };

        document.addEventListener( 'click', handleClickOutside );
    }, [] );

    const handleKeyDown = ( e ) => {
        if ( e.key === 'ArrowDown' ) {
            setHighlightedIndex( ( prev ) => prev + 1 );
        }
        else if ( e.key === 'ArrowUp' ) {
            setHighlightedIndex( ( prev ) => prev - 1 );
        }
        else if ( e.key === 'Enter' ) {
            if ( filteredUsers[ highlightedIndex ] ) {
                handleSelectUser( filteredUsers[ highlightedIndex ] );
            }
        }
    };

    const handleSelectUser = ( user ) => {
        setSelectedUser( user );
        setQuery( user.name );
        setIsDropdownOpen( false );
    };

    const handleInputChange = ( e ) => {
        setQuery( e.target.value );
        setSelectedUser( null );
    };

    return (
        <div
            style={ {
                position: 'relative',
                width: '400px',
                margin: '40px auto',
            } }
        >
            <h2>User Search</h2>

            <input
                ref={ inputRef }
                type='text'
                value={ query }
                onChange={ handleInputChange }
                onKeyDown={ handleKeyDown }
                placeholder='Search users by name...'
                style={ {
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                } }
            />

            { isLoading && (
            <div
                style={ {
                    padding: '8px',
                } }
            >Loading...
            </div>
            ) }

            { isDropdownOpen && filteredUsers.length > 0 && (
            <ul
                style={ {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    border: '1px solid #ccc',
                    background: '#fff',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 10,
                } }
            >
                { filteredUsers.map( ( user, index ) => (
                    <li
                        key={ user.id }
                        onClick={ () => handleSelectUser( user ) }
                        style={ {
                            padding: '10px',
                            cursor: 'pointer',
                            backgroundColor:
                  index === highlightedIndex ?
                      '#e6f0ff' :
                      '#fff',
                        } }
                    >
                        <strong>{ user.name }</strong>
                        <br />
                        <small>{ user.email }</small>
                    </li>
                ) ) }
            </ul>
            ) }

            { selectedUser && (
            <div
                style={ {
                    marginTop: '20px',
                    padding: '16px',
                    border: '1px solid #4CAF50',
                    borderRadius: '8px',
                } }
            >
                <h3>Selected User</h3>
                <p>
                    <strong>Name:</strong> { selectedUser.name }
                </p>
                <p>
                    <strong>Email:</strong> { selectedUser.email }
                </p>
                <p>
                    <strong>Company:</strong> { selectedUser.company.name }
                </p>
            </div>
            ) }

            { isDropdownOpen && filteredUsers.length === 0 && ! isLoading && (
            <div
                style={ {
                    padding: '10px',
                    color: '#999',
                } }
            >No users found
            </div>
            ) }
        </div>
    );
}
