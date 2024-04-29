package generate

import (
	"math/rand"
	"time"
)

var Maps = GenerateMap()

func GenerateMap() [][]int {
	bombermanMap := [][]int{
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
		{1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 3, 3, 1},
		{1, 3, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 3, 1},
		{1, 3, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 3, 1},
		{1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
		{1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
		{1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
		{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
		{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
		{1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1},
		{1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1},
		{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
		{1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
		{1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
		{1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
		{1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1},
		{1, 3, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 3, 1},
		{1, 3, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 3, 1},
		{1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1},
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
	}
	rand.Seed(time.Now().UnixNano())

	emptyCells := make([][2]int, 0)

	// Trouver toutes les cases vides contenant le chiffre 0
	for i, row := range bombermanMap {
		for j, cell := range row {
			if cell == 0 {
				emptyCells = append(emptyCells, [2]int{i, j})
			}
		}
	}
	// Générer 150 fois le chiffre 2
	for i := 0; i < 130 && len(emptyCells) > 0; i++ {
		randomIndex := rand.Intn(len(emptyCells))
		randomCell := emptyCells[randomIndex]
		bombermanMap[randomCell[0]][randomCell[1]] = 2
		emptyCells = append(emptyCells[:randomIndex], emptyCells[randomIndex+1:]...)
	}
	for i := 0; i < 8 && len(emptyCells) > 0; i++ {
		randomIndex := rand.Intn(len(emptyCells))
		randomCell := emptyCells[randomIndex]
		bombermanMap[randomCell[0]][randomCell[1]] = 4
		emptyCells = append(emptyCells[:randomIndex], emptyCells[randomIndex+1:]...)
	}
	for i := 0; i < 7 && len(emptyCells) > 0; i++ {
		randomIndex := rand.Intn(len(emptyCells))
		randomCell := emptyCells[randomIndex]
		bombermanMap[randomCell[0]][randomCell[1]] = 5
		emptyCells = append(emptyCells[:randomIndex], emptyCells[randomIndex+1:]...)
	}
	for i := 0; i < 5 && len(emptyCells) > 0; i++ {
		randomIndex := rand.Intn(len(emptyCells))
		randomCell := emptyCells[randomIndex]
		bombermanMap[randomCell[0]][randomCell[1]] = 6
		emptyCells = append(emptyCells[:randomIndex], emptyCells[randomIndex+1:]...)
	}
	return bombermanMap
}
