import { NextApiResponse, NextApiRequest } from "next";
import { without } from "lodash";

import prismadb from "@/lib/prismadb";

import serverAuth from "@/lib/serverAuth";

export default async function handler (req:NextApiRequest, res: NextApiResponse){
    try{
        if(req.method ==="POST"){
            const { currentUser } = await serverAuth(req)

            const {movieId} = req.body;

            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            })

            if(!existingMovie){
                throw new Error('Invalid Id')
            }

            const user = await prismadb.user.update({
                where:{
                    email:currentUser.email,
                },
                data:{
                    favoritesIds:{
                        push: movieId
                    }
                }
            });

            return res.status(200).json(user)
        }

        if(req.method === 'DELETE'){
            const { currentUser } = await serverAuth(req)

            const {movieId} = req.body;

            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            })

            if(!existingMovie){
                throw new Error('Invalid Id')
            }

            const updateFavoritesIds = without(currentUser.favoritesIds, movieId)

            const updateUser = await prismadb.user.update({
                where:{
                    email: currentUser.email
                },
                data:{
                    favoriteIds: updateFavoritesIds
                }
            });

            return res.status(200).json(updateUser);
        }
        return res.status(405).end();
    }catch(error){
        console.log(error);
        return res.status(400).end();
        
    }
}