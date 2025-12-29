import type { NextApiRequest, NextApiResponse } from 'next';

const checkFields = <T>(fields: T) => {
  // Add your field checking logic here
  return fields;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Remove the checkFields function call
    // Add your route logic here
    res.status(200).json({ message: 'Test register route' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
