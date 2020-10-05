import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export function useStage(player, resetPlayer)
{
    const [ stage, setStage ] = useState(createStage());
    const [rowCleared, setRowsCleared ] = useState(0);


    // const addRow = (stage, setStage) => {
    //     for (let i = 1; i < stage.length; i++)
    //         stage[i - 1] = [...stage[i]];

    //     stage[stage.length - 1] = new Array(stage[0].length).fill(["B", "test"]);
    //     setStage(stage);
    // };



    useEffect(() => {

        // will work once at a time
        // param for socket 
        const sweepRows = (newStage) => {
            newStage.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);
        }

        const updateStage = prevStage => {
            // flush
            const newStage = prevStage.map(row => 
                (row.map(cell => cell[1] === 'clear' ? [0, 'clear'] : cell)
            ));

            // draw
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0){
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ]
                    }                    
                });
            });

            if (player.collided){
                resetPlayer();
                //return sweepRows(newStage);
                // do some socket stuff also
            }
            
            return newStage;
        }

        setStage(prev => updateStage(prev)); // param + player + resetPlayer + shapeTrack + socket

        // new dep 
    },[player]); // add resetplayer + socket + rowsCleared + shapeTrack + shapes
    // },[player.collided, player.pos.x, player.pos.y, player.tetromino]);
    return [stage, setStage, rowCleared]; // add addRow function
}