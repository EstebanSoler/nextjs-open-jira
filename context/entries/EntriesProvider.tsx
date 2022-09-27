import { FC, ReactNode, useReducer, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { EntriesContext, entriesReducer } from '.';
import { entriesApi } from '../../apis';
import { Entry } from '../../interfaces';

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [],
}

interface Props {
  children: ReactNode;
}

export const EntriesProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);
  const { enqueueSnackbar } = useSnackbar();

  const addNewEntry = async (description: string) => {

    const {data} = await entriesApi.post<Entry>('/entries', { description });
    dispatch({ type: '[Entry] Add-Entry', payload: data});
  }

  const updateEntry = async ({_id, description, status }: Entry, showSnackbar?: boolean) => {
    try {
      const {data} = await entriesApi.put<Entry>(`/entries/${_id}`, { description, status});
      dispatch({type: '[Entry] Entry-Updated', payload: data});

      if( showSnackbar) {
        enqueueSnackbar('Entrada Actualizada', {
          variant: 'success',
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        })
      }

    } catch (error) {
      console.log({error});
    } 
  }

  const deleteEntry = async ({_id, description, status }: Entry, showSnackbar?: boolean) => {
    try {
      const data: Entry = {
        _id, description, status,
        createdAt: 0
      }
      await entriesApi.delete<Entry>(`/entries/${_id}`);
      dispatch({type: '[Entry] Entry-Deleted', payload: data});

      if( showSnackbar) {
        enqueueSnackbar('Entrada Eliminada con Exito', {
          variant: 'success',
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        })
      }

    } catch (error) {
      console.log({error});
    } 
  }

  const refreshEntries = async() => {
    const { data } = await entriesApi.get<Entry[]>('/entries');
    dispatch({ type: '[Entry] Refresh-Data', payload: data });

  }

  useEffect(() => {
    refreshEntries();
  }, []);
  

  return(
    <EntriesContext.Provider value={{
      ...state,

      //Methods
      addNewEntry,
      updateEntry,
      deleteEntry,
    }}>
    { children}
    </EntriesContext.Provider>
  )
}