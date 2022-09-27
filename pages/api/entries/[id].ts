import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Entry, IEntry } from '../../../models';

type Data = 
| {message: string}
| IEntry;

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

  const { id } = req.query;
  console.log(id)

  if(!mongoose.isValidObjectId(id)){
    return res.status(400).json({ message: 'El id no es válido ' + id })
  }

  switch ( req.method) {
    case 'PUT':
      return updateEntry( req, res );

    case 'GET':
      return getEntry( req, res );

    case 'DELETE':
      return deleteEntry( req, res );
    
    default:
      return res.status(400).json({ message: 'Metodo no existe' + id })
  }

}

const updateEntry = async(req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  
  await db.connect();

  const entryToUpdate = await Entry.findById( id );

  if ( !entryToUpdate) {
    await db.disconnect();
    return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id });
  }

  const {
    description = entryToUpdate.description,
    status = entryToUpdate.status,
  } = req.body;

  try {
    const updateEntry = await Entry.findByIdAndUpdate( id, { description, status}, { runValidators: true, new:true});
    await db.disconnect();
    res.status(200).json( updateEntry! );
  } catch(error: any) {
    await db.disconnect();
    res.status(400).json({ message: error.errors.status.message });
  } 

}

const deleteEntry = async(req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  
  await db.connect();

  const entryToUpdate = await Entry.findById( id );

  if ( !entryToUpdate) {
    await db.disconnect();
    return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id });
  }


  try {
    await Entry.findByIdAndDelete( id );
    await db.disconnect();
    res.status(200).json( { message: 'Se elimino entrada con ID: ' + id } );
  } catch(error: any) {
    await db.disconnect();
    res.status(400).json({ message: error.errors.status.message });
  } 

}

const getEntry = async(req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  
  await db.connect();

  const entryInDB = await Entry.findById( id );
  await db.disconnect();

  if ( !entryInDB) {
    return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id });
  }

  res.status(200).json( entryInDB );

}