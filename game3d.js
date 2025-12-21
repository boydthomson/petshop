class PetShopGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animals = [];
        this.selectedAnimal = null;
        this.cameraAngle = 0;
        this.cameraDistance = 15;
        this.cameraHeight = 8;
        this.playerPosition = { x: 0, z: 0 };
        this.keys = {};
        this.mouseDown = false;
        this.lastMouseX = 0;

        this.init();
    }

    init() {
        this.setupScene();
        this.createPetStore();
        this.createAnimals();
        this.setupLights();
        this.setupEventListeners();
        this.animate();

        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1500);
    }

    setupScene() {
        const canvas = document.getElementById('game-canvas');
        this.scene = new THREE.Scene();

        // More realistic warm indoor background
        this.scene.background = new THREE.Color(0xE8D4B8);
        this.scene.fog = new THREE.Fog(0xE8D4B8, 35, 65);

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.3;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    createPetStore() {
        const floorGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xc19a6b,
            roughness: 0.9,
            metalness: 0.0
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Enhanced realistic wood planks with grain variations
        for (let i = 0; i < 50; i += 5) {
            for (let j = 0; j < 50; j += 2) {
                const plankGeometry = new THREE.PlaneGeometry(1.8, 4.8);

                // Random wood colors with more variation
                const hue = 0.08 + Math.random() * 0.03;
                const saturation = 0.35 + Math.random() * 0.15;
                const lightness = 0.30 + Math.random() * 0.15;

                const plankMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(hue, saturation, lightness),
                    roughness: 0.75 + Math.random() * 0.15,
                    metalness: 0.0
                });
                const plank = new THREE.Mesh(plankGeometry, plankMaterial);
                plank.rotation.x = -Math.PI / 2;
                plank.position.set(i - 25, 0.01, j - 25);
                plank.receiveShadow = true;
                this.scene.add(plank);

                // Wood grain lines
                if (Math.random() > 0.6) {
                    const grainGeo = new THREE.PlaneGeometry(0.1, 4.5);
                    const grainMat = new THREE.MeshStandardMaterial({
                        color: new THREE.Color().setHSL(hue, saturation, lightness - 0.08),
                        roughness: 0.9,
                        transparent: true,
                        opacity: 0.4
                    });
                    const grain = new THREE.Mesh(grainGeo, grainMat);
                    grain.rotation.x = -Math.PI / 2;
                    grain.position.set(i - 25 + (Math.random() - 0.5) * 1.5, 0.011, j - 25);
                    this.scene.add(grain);
                }
            }
        }

        this.createCeiling();
        this.createWalls();
        this.createShelves();
        this.createDecorations();
        this.createFurniture();
        this.createWindowsAndDoor();
    }

    createCeiling() {
        const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
        const ceilingMaterial = new THREE.MeshStandardMaterial({
            color: 0xFAFAFA,
            roughness: 0.85,
            side: THREE.DoubleSide
        });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 10;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);

        // Ceiling tiles for realism
        for (let i = -24; i < 25; i += 4) {
            for (let j = -24; j < 25; j += 4) {
                const tileGeo = new THREE.PlaneGeometry(3.9, 3.9);
                const tileMat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0, 0, 0.94 + Math.random() * 0.04),
                    roughness: 0.9,
                    side: THREE.DoubleSide
                });
                const tile = new THREE.Mesh(tileGeo, tileMat);
                tile.rotation.x = Math.PI / 2;
                tile.position.set(i, 9.99, j);
                this.scene.add(tile);
            }
        }

        // Ceiling lights/fixtures
        for (let i = -15; i <= 15; i += 15) {
            for (let j = -15; j <= 15; j += 15) {
                const lightFixtureGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 20);
                const lightFixtureMat = new THREE.MeshStandardMaterial({
                    color: 0xEEEEEE,
                    roughness: 0.3,
                    metalness: 0.5,
                    emissive: 0xFFFFDD,
                    emissiveIntensity: 0.4
                });
                const lightFixture = new THREE.Mesh(lightFixtureGeo, lightFixtureMat);
                lightFixture.position.set(i, 9.7, j);
                lightFixture.castShadow = true;
                this.scene.add(lightFixture);
            }
        }
    }

    createWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xF5E6D3,
            roughness: 0.90
        });

        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(50, 10, 0.5),
            wallMaterial
        );
        backWall.position.set(0, 5, -25);
        backWall.receiveShadow = true;
        backWall.castShadow = true;
        this.scene.add(backWall);

        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 10, 50),
            wallMaterial
        );
        leftWall.position.set(-25, 5, 0);
        leftWall.receiveShadow = true;
        leftWall.castShadow = true;
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 10, 50),
            wallMaterial
        );
        rightWall.position.set(25, 5, 0);
        rightWall.receiveShadow = true;
        rightWall.castShadow = true;
        this.scene.add(rightWall);

        // Enhanced baseboards with detail
        const baseboard = new THREE.Mesh(
            new THREE.BoxGeometry(50, 0.4, 0.25),
            new THREE.MeshStandardMaterial({
                color: 0x5d4e37,
                roughness: 0.6,
                metalness: 0.0
            })
        );
        baseboard.position.set(0, 0.2, -24.85);
        baseboard.castShadow = true;
        this.scene.add(baseboard);

        // Left wall baseboard
        const baseboardLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.4, 50),
            new THREE.MeshStandardMaterial({
                color: 0x5d4e37,
                roughness: 0.6
            })
        );
        baseboardLeft.position.set(-24.85, 0.2, 0);
        baseboardLeft.castShadow = true;
        this.scene.add(baseboardLeft);

        // Right wall baseboard
        const baseboardRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.4, 50),
            new THREE.MeshStandardMaterial({
                color: 0x5d4e37,
                roughness: 0.6
            })
        );
        baseboardRight.position.set(24.85, 0.2, 0);
        baseboardRight.castShadow = true;
        this.scene.add(baseboardRight);

        // Wall art/posters for realism
        this.addWallDecor();
    }

    addWallDecor() {
        // Pet shop posters on back wall
        const posterPositions = [
            { x: -12, y: 5.5 },
            { x: 0, y: 6 },
            { x: 12, y: 5.5 }
        ];

        posterPositions.forEach((pos, index) => {
            const frameGeo = new THREE.PlaneGeometry(2.5, 3);
            const frameMat = new THREE.MeshStandardMaterial({
                color: index === 1 ? 0x4169E1 : (index === 0 ? 0xFF6347 : 0x32CD32),
                roughness: 0.4
            });
            const frame = new THREE.Mesh(frameGeo, frameMat);
            frame.position.set(pos.x, pos.y, -24.7);
            frame.castShadow = true;
            this.scene.add(frame);

            // Inner poster content
            const posterGeo = new THREE.PlaneGeometry(2.2, 2.7);
            const posterMat = new THREE.MeshStandardMaterial({
                color: 0xFFFAF0,
                roughness: 0.7
            });
            const poster = new THREE.Mesh(posterGeo, posterMat);
            poster.position.set(pos.x, pos.y, -24.65);
            this.scene.add(poster);
        });
    }

    createWindowsAndDoor() {
        const windowFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.6 });
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.4,
            roughness: 0.1,
            metalness: 0.1
        });

        for (let i = 0; i < 3; i++) {
            const windowFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3, 2.5, 0.3),
                windowFrameMaterial
            );
            windowFrame.position.set(-15 + i * 15, 6, -24.75);
            windowFrame.castShadow = true;
            this.scene.add(windowFrame);

            const windowGlass = new THREE.Mesh(
                new THREE.PlaneGeometry(2.6, 2.2),
                glassMaterial
            );
            windowGlass.position.set(-15 + i * 15, 6, -24.6);
            this.scene.add(windowGlass);

            const windowSill = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 0.2, 0.4),
                windowFrameMaterial
            );
            windowSill.position.set(-15 + i * 15, 4.6, -24.7);
            windowSill.castShadow = true;
            this.scene.add(windowSill);
        }

        const doorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 5, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 })
        );
        doorFrame.position.set(0, 2.5, 24.85);
        doorFrame.castShadow = true;
        this.scene.add(doorFrame);

        const door = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 4.5, 0.15),
            new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 })
        );
        door.position.set(0, 2.5, 24.9);
        door.castShadow = true;
        this.scene.add(door);

        const doorHandle = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 })
        );
        doorHandle.position.set(0.8, 2.5, 25);
        this.scene.add(doorHandle);
    }

    createShelves() {
        const shelfMaterial = new THREE.MeshStandardMaterial({
            color: 0x5d4e37,
            roughness: 0.8,
            metalness: 0.0
        });

        for (let i = 0; i < 4; i++) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(8, 0.3, 1.5),
                shelfMaterial
            );
            shelf.position.set(-15 + i * 10, 2, -23);
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            this.scene.add(shelf);

            const support = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 2, 0.3),
                shelfMaterial
            );
            support.position.set(-15 + i * 10, 1, -23);
            support.castShadow = true;
            this.scene.add(support);
        }
    }

    createDecorations() {
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf];

        for (let i = 0; i < 15; i++) {
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.5, 0.5),
                new THREE.MeshStandardMaterial({
                    color: colors[Math.floor(Math.random() * colors.length)]
                })
            );
            box.position.set(
                -18 + Math.random() * 6 + Math.floor(i / 4) * 10,
                2.2 + Math.random() * 0.5,
                -23 + Math.random() * 0.5
            );
            box.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            box.castShadow = true;
            this.scene.add(box);
        }
    }

    createFurniture() {
        this.createCounter();
        this.createDisplayCases();
        this.createChairs();
        this.createPetBeds();
        this.createPlants();
        this.createToyBoxes();
        this.createCabinets();
    }

    createCounter() {
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x6b4423,
            roughness: 0.75,
            metalness: 0.0
        });

        const counter = new THREE.Mesh(
            new THREE.BoxGeometry(6, 1, 2),
            woodMaterial
        );
        counter.position.set(15, 0.5, 20);
        counter.castShadow = true;
        counter.receiveShadow = true;
        this.scene.add(counter);

        const counterTop = new THREE.Mesh(
            new THREE.BoxGeometry(6.2, 0.1, 2.2),
            new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.4, metalness: 0.1 })
        );
        counterTop.position.set(15, 1.05, 20);
        counterTop.castShadow = true;
        this.scene.add(counterTop);

        const cashRegister = new THREE.Group();
        const registerBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.4, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x444444 })
        );
        cashRegister.add(registerBase);

        const registerScreen = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.5, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.3 })
        );
        registerScreen.position.set(0, 0.25, 0.3);
        registerScreen.rotation.x = -0.3;
        cashRegister.add(registerScreen);

        cashRegister.position.set(15, 1.3, 20);
        cashRegister.castShadow = true;
        this.scene.add(cashRegister);
    }

    createDisplayCases() {
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaccff,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.5
        });

        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

        for (let i = 0; i < 2; i++) {
            const displayCase = new THREE.Group();

            const base = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.2, 2),
                frameMaterial
            );
            displayCase.add(base);

            const glass = new THREE.Mesh(
                new THREE.BoxGeometry(2.8, 2, 1.8),
                glassMaterial
            );
            glass.position.y = 1.1;
            displayCase.add(glass);

            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(3, 2, 2),
                frameMaterial
            );
            frame.position.y = 1.1;
            frame.scale.set(1.01, 1.01, 1.01);
            displayCase.add(frame);

            displayCase.position.set(-15 + i * 8, 0.1, 15);
            displayCase.castShadow = true;
            displayCase.receiveShadow = true;
            this.scene.add(displayCase);

            const toy = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0xff6b6b })
            );
            toy.position.set(-15 + i * 8, 1.2, 15);
            this.scene.add(toy);
        }
    }

    createChairs() {
        const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });

        for (let i = 0; i < 3; i++) {
            const chair = new THREE.Group();

            const seat = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.2, 1),
                chairMaterial
            );
            seat.position.y = 0.5;
            chair.add(seat);

            const back = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1.5, 0.2),
                chairMaterial
            );
            back.position.set(0, 1.15, -0.4);
            chair.add(back);

            for (let j = 0; j < 4; j++) {
                const leg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.05, 0.05, 0.5),
                    chairMaterial
                );
                leg.position.set(
                    j % 2 === 0 ? -0.4 : 0.4,
                    0.25,
                    j < 2 ? -0.4 : 0.4
                );
                chair.add(leg);
            }

            chair.position.set(18, 0, 15 - i * 3);
            chair.rotation.y = -Math.PI / 4;
            chair.castShadow = true;
            this.scene.add(chair);
        }
    }

    createPetBeds() {
        const bedPositions = [
            { x: -8, z: 5 },
            { x: 8, z: 5 },
            { x: -8, z: -5 },
            { x: 8, z: -5 }
        ];

        const bedColors = [0xe91e63, 0x2196f3, 0x4caf50, 0xff9800];

        bedPositions.forEach((pos, index) => {
            const bedGroup = new THREE.Group();

            const bedBase = new THREE.Mesh(
                new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32),
                new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.85 })
            );
            bedGroup.add(bedBase);

            const cushion = new THREE.Mesh(
                new THREE.CylinderGeometry(1, 1, 0.2, 32),
                new THREE.MeshStandardMaterial({ color: bedColors[index], roughness: 0.95 })
            );
            cushion.position.y = 0.25;
            bedGroup.add(cushion);

            bedGroup.position.set(pos.x - 2, 0.15, pos.z - 2);
            bedGroup.castShadow = true;
            bedGroup.receiveShadow = true;
            this.scene.add(bedGroup);

            const foodBowl = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.2, 0.15, 16),
                new THREE.MeshStandardMaterial({ color: 0xdc143c, metalness: 0.6, roughness: 0.3 })
            );
            foodBowl.position.set(pos.x + 2, 0.08, pos.z - 2);
            foodBowl.castShadow = true;
            this.scene.add(foodBowl);

            const water = new THREE.Mesh(
                new THREE.CylinderGeometry(0.25, 0.18, 0.1, 16),
                new THREE.MeshStandardMaterial({
                    color: 0x4169e1,
                    transparent: true,
                    opacity: 0.7,
                    roughness: 0.1,
                    metalness: 0.2
                })
            );
            water.position.set(pos.x + 2.5, 0.1, pos.z - 2);
            this.scene.add(water);

            const waterBowl = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.2, 0.15, 16),
                new THREE.MeshStandardMaterial({ color: 0x1e90ff, metalness: 0.6, roughness: 0.3 })
            );
            waterBowl.position.set(pos.x + 2.5, 0.08, pos.z - 2);
            waterBowl.castShadow = true;
            this.scene.add(waterBowl);
        });
    }

    createPlants() {
        const potMaterial = new THREE.MeshStandardMaterial({ color: 0xd2691e });
        const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

        const plantPositions = [
            { x: -20, z: 20 },
            { x: 20, z: -15 },
            { x: -20, z: -15 },
            { x: 0, z: 20 }
        ];

        plantPositions.forEach(pos => {
            const pot = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.3, 0.6, 16),
                potMaterial
            );
            pot.position.set(pos.x, 0.3, pos.z);
            pot.castShadow = true;
            this.scene.add(pot);

            const plant = new THREE.Mesh(
                new THREE.SphereGeometry(0.6, 16, 16),
                plantMaterial
            );
            plant.position.set(pos.x, 0.9, pos.z);
            plant.scale.set(1, 1.3, 1);
            plant.castShadow = true;
            this.scene.add(plant);
        });
    }

    createToyBoxes() {
        const toyBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });

        const toyBoxPositions = [
            { x: -12, z: 12 },
            { x: 12, z: 12 }
        ];

        toyBoxPositions.forEach(pos => {
            const toyBox = new THREE.Mesh(
                new THREE.BoxGeometry(2, 1.5, 2),
                toyBoxMaterial
            );
            toyBox.position.set(pos.x, 0.75, pos.z);
            toyBox.castShadow = true;
            toyBox.receiveShadow = true;
            this.scene.add(toyBox);

            const lid = new THREE.Mesh(
                new THREE.BoxGeometry(2.1, 0.2, 2.1),
                new THREE.MeshStandardMaterial({ color: 0xff4500 })
            );
            lid.position.set(pos.x, 1.6, pos.z);
            lid.castShadow = true;
            this.scene.add(lid);

            for (let i = 0; i < 3; i++) {
                const ball = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 16, 16),
                    new THREE.MeshStandardMaterial({
                        color: [0xffff00, 0x00ffff, 0xff00ff][i]
                    })
                );
                ball.position.set(
                    pos.x + (i - 1) * 0.4,
                    1.8,
                    pos.z
                );
                ball.castShadow = true;
                this.scene.add(ball);
            }
        });
    }

    createCabinets() {
        const cabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });

        for (let i = 0; i < 3; i++) {
            const cabinet = new THREE.Mesh(
                new THREE.BoxGeometry(2, 3, 1.5),
                cabinetMaterial
            );
            cabinet.position.set(-22, 1.5, -15 + i * 8);
            cabinet.castShadow = true;
            cabinet.receiveShadow = true;
            this.scene.add(cabinet);

            const handle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 0.5),
                handleMaterial
            );
            handle.rotation.z = Math.PI / 2;
            handle.position.set(-21, 1.5, -15 + i * 8);
            this.scene.add(handle);

            const topShelf = new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.1, 1.5),
                new THREE.MeshStandardMaterial({ color: 0x8b4513 })
            );
            topShelf.position.set(-22, 3.1, -15 + i * 8);
            this.scene.add(topShelf);
        }
    }

    addSpeciesFeatures(group, animalType, bodyMaterial, color) {
        switch(animalType) {
            case 'dog':
                // Realistic floppy ears with inner detail
                const dogEarGeo = new THREE.BoxGeometry(0.4, 0.9, 0.12);
                const leftDogEar = new THREE.Mesh(dogEarGeo, bodyMaterial);
                leftDogEar.position.set(-0.6, 0.5, 0.8);
                leftDogEar.rotation.set(0.3, 0, 0.7);
                leftDogEar.castShadow = true;
                group.add(leftDogEar);

                // Inner ear (lighter color)
                const dogInnerEarGeo = new THREE.BoxGeometry(0.25, 0.6, 0.1);
                const dogInnerEarMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color).offsetHSL(0, -0.2, 0.4),
                    roughness: 0.9
                });
                const leftInnerEar = new THREE.Mesh(dogInnerEarGeo, dogInnerEarMaterial);
                leftInnerEar.position.set(-0.6, 0.45, 0.85);
                leftInnerEar.rotation.set(0.3, 0, 0.7);
                group.add(leftInnerEar);

                const rightDogEar = new THREE.Mesh(dogEarGeo, bodyMaterial);
                rightDogEar.position.set(0.6, 0.5, 0.8);
                rightDogEar.rotation.set(0.3, 0, -0.7);
                rightDogEar.castShadow = true;
                group.add(rightDogEar);

                const rightInnerEar = new THREE.Mesh(dogInnerEarGeo, dogInnerEarMaterial);
                rightInnerEar.position.set(0.6, 0.45, 0.85);
                rightInnerEar.rotation.set(0.3, 0, -0.7);
                group.add(rightInnerEar);

                // Dog collar
                const collarGeo = new THREE.TorusGeometry(0.55, 0.08, 8, 20);
                const collarMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFF0000,
                    roughness: 0.4,
                    metalness: 0.6
                });
                const collar = new THREE.Mesh(collarGeo, collarMaterial);
                collar.position.set(0, 0.2, 0.9);
                collar.rotation.x = Math.PI / 2;
                collar.castShadow = true;
                group.add(collar);

                // Collar tag
                const tagGeo = new THREE.BoxGeometry(0.15, 0.2, 0.03);
                const tagMaterial = new THREE.MeshStandardMaterial({
                    color: 0xC0C0C0,
                    roughness: 0.2,
                    metalness: 0.9
                });
                const tag = new THREE.Mesh(tagGeo, tagMaterial);
                tag.position.set(0, 0.05, 1.15);
                group.add(tag);

                // Tongue (hanging out slightly)
                const tongueGeo = new THREE.BoxGeometry(0.15, 0.08, 0.3);
                const tongueMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFF69B4,
                    roughness: 0.7
                });
                const tongue = new THREE.Mesh(tongueGeo, tongueMaterial);
                tongue.position.set(0, 0.15, 1.55);
                tongue.rotation.x = 0.3;
                group.add(tongue);

                break;

            case 'cat':
                // Realistic pointed triangular ears
                const catEarGeo = new THREE.ConeGeometry(0.25, 0.5, 4);
                const leftCatEar = new THREE.Mesh(catEarGeo, bodyMaterial);
                leftCatEar.position.set(-0.4, 1.2, 0.9);
                leftCatEar.rotation.z = -0.2;
                leftCatEar.castShadow = true;
                group.add(leftCatEar);

                // Pink inner ear detail
                const catInnerEarGeo = new THREE.ConeGeometry(0.15, 0.35, 4);
                const catInnerEarMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFB6C1,
                    roughness: 0.8
                });
                const leftCatInnerEar = new THREE.Mesh(catInnerEarGeo, catInnerEarMaterial);
                leftCatInnerEar.position.set(-0.4, 1.2, 0.95);
                leftCatInnerEar.rotation.z = -0.2;
                leftCatInnerEar.castShadow = true;
                group.add(leftCatInnerEar);

                const rightCatEar = new THREE.Mesh(catEarGeo, bodyMaterial);
                rightCatEar.position.set(0.4, 1.2, 0.9);
                rightCatEar.rotation.z = 0.2;
                rightCatEar.castShadow = true;
                group.add(rightCatEar);

                const rightCatInnerEar = new THREE.Mesh(catInnerEarGeo, catInnerEarMaterial);
                rightCatInnerEar.position.set(0.4, 1.2, 0.95);
                rightCatInnerEar.rotation.z = 0.2;
                rightCatInnerEar.castShadow = true;
                group.add(rightCatInnerEar);

                // Whiskers - long thin cylinders
                const whiskerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF,
                    roughness: 0.3,
                    metalness: 0.1
                });
                const whiskerGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.6, 4);

                // Left whiskers
                for (let i = 0; i < 3; i++) {
                    const whisker = new THREE.Mesh(whiskerGeo, whiskerMaterial);
                    whisker.position.set(-0.35, 0.3 + i * 0.05, 1.4);
                    whisker.rotation.set(0, 0, Math.PI / 2 + (i - 1) * 0.15);
                    group.add(whisker);
                }

                // Right whiskers
                for (let i = 0; i < 3; i++) {
                    const whisker = new THREE.Mesh(whiskerGeo, whiskerMaterial);
                    whisker.position.set(0.35, 0.3 + i * 0.05, 1.4);
                    whisker.rotation.set(0, 0, Math.PI / 2 - (i - 1) * 0.15);
                    group.add(whisker);
                }

                // Stripes for tabby pattern (stored for later use)
                const stripeColor = new THREE.Color(color).offsetHSL(0, 0, -0.3);
                const stripeMaterial = new THREE.MeshStandardMaterial({
                    color: stripeColor,
                    roughness: 0.95
                });

                // Head stripes
                for (let i = 0; i < 4; i++) {
                    const stripeGeo = new THREE.BoxGeometry(0.08, 0.3, 0.2);
                    const stripe = new THREE.Mesh(stripeGeo, stripeMaterial);
                    stripe.position.set(-0.3 + i * 0.2, 0.6, 1.3);
                    stripe.rotation.y = -0.3;
                    group.add(stripe);
                }

                // Body stripes
                for (let i = 0; i < 5; i++) {
                    const bodyStripeGeo = new THREE.BoxGeometry(0.15, 0.8, 0.1);
                    const bodyStripe = new THREE.Mesh(bodyStripeGeo, stripeMaterial);
                    bodyStripe.position.set(-0.5 + i * 0.25, 0, -0.2 + i * 0.15);
                    bodyStripe.rotation.y = 0.2;
                    group.add(bodyStripe);
                }

                break;

            case 'rabbit':
                // Long realistic bunny ears
                const rabbitEarGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.4, 12);
                const leftRabbitEar = new THREE.Mesh(rabbitEarGeo, bodyMaterial);
                leftRabbitEar.position.set(-0.25, 1.5, 0.65);
                leftRabbitEar.rotation.set(0.4, 0, 0.15);
                leftRabbitEar.castShadow = true;
                group.add(leftRabbitEar);

                // Pink inner ear
                const rabbitInnerEarGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 12);
                const rabbitInnerEarMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFB6C1,
                    roughness: 0.8
                });
                const leftRabbitInnerEar = new THREE.Mesh(rabbitInnerEarGeo, rabbitInnerEarMaterial);
                leftRabbitInnerEar.position.set(-0.25, 1.5, 0.7);
                leftRabbitInnerEar.rotation.set(0.4, 0, 0.15);
                group.add(leftRabbitInnerEar);

                const rightRabbitEar = new THREE.Mesh(rabbitEarGeo, bodyMaterial);
                rightRabbitEar.position.set(0.25, 1.5, 0.65);
                rightRabbitEar.rotation.set(0.4, 0, -0.15);
                rightRabbitEar.castShadow = true;
                group.add(rightRabbitEar);

                const rightRabbitInnerEar = new THREE.Mesh(rabbitInnerEarGeo, rabbitInnerEarMaterial);
                rightRabbitInnerEar.position.set(0.25, 1.5, 0.7);
                rightRabbitInnerEar.rotation.set(0.4, 0, -0.15);
                group.add(rightRabbitInnerEar);

                // Bunny whiskers
                const rabbitWhiskerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xEEEEEE,
                    roughness: 0.3
                });
                const rabbitWhiskerGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.5, 4);

                for (let i = 0; i < 3; i++) {
                    const whisker = new THREE.Mesh(rabbitWhiskerGeo, rabbitWhiskerMaterial);
                    whisker.position.set(-0.28, 0.55 + i * 0.04, 1.3);
                    whisker.rotation.set(0, 0, Math.PI / 2 + (i - 1) * 0.12);
                    group.add(whisker);

                    const whisker2 = new THREE.Mesh(rabbitWhiskerGeo, rabbitWhiskerMaterial);
                    whisker2.position.set(0.28, 0.55 + i * 0.04, 1.3);
                    whisker2.rotation.set(0, 0, Math.PI / 2 - (i - 1) * 0.12);
                    group.add(whisker2);
                }

                // Front teeth (buck teeth)
                const toothGeo = new THREE.BoxGeometry(0.08, 0.15, 0.06);
                const toothMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFAF0,
                    roughness: 0.3
                });
                const leftTooth = new THREE.Mesh(toothGeo, toothMaterial);
                leftTooth.position.set(-0.06, 0.45, 1.35);
                group.add(leftTooth);

                const rightTooth = new THREE.Mesh(toothGeo, toothMaterial);
                rightTooth.position.set(0.06, 0.45, 1.35);
                group.add(rightTooth);

                break;

            case 'hamster':
                // Rounded ears with pink inner
                const hamsterEarGeo = new THREE.SphereGeometry(0.18, 16, 16);
                const leftHamsterEar = new THREE.Mesh(hamsterEarGeo, bodyMaterial);
                leftHamsterEar.position.set(-0.45, 0.95, 0.6);
                leftHamsterEar.scale.set(1, 0.65, 0.45);
                leftHamsterEar.castShadow = true;
                group.add(leftHamsterEar);

                const hamsterInnerEarGeo = new THREE.SphereGeometry(0.12, 12, 12);
                const hamsterInnerEarMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFCCDD,
                    roughness: 0.9
                });
                const leftHamsterInnerEar = new THREE.Mesh(hamsterInnerEarGeo, hamsterInnerEarMaterial);
                leftHamsterInnerEar.position.set(-0.45, 0.95, 0.65);
                leftHamsterInnerEar.scale.set(0.8, 0.5, 0.3);
                group.add(leftHamsterInnerEar);

                const rightHamsterEar = new THREE.Mesh(hamsterEarGeo, bodyMaterial);
                rightHamsterEar.position.set(0.45, 0.95, 0.6);
                rightHamsterEar.scale.set(1, 0.65, 0.45);
                rightHamsterEar.castShadow = true;
                group.add(rightHamsterEar);

                const rightHamsterInnerEar = new THREE.Mesh(hamsterInnerEarGeo, hamsterInnerEarMaterial);
                rightHamsterInnerEar.position.set(0.45, 0.95, 0.65);
                rightHamsterInnerEar.scale.set(0.8, 0.5, 0.3);
                group.add(rightHamsterInnerEar);

                // Chubby cheek pouches
                const cheekGeo = new THREE.SphereGeometry(0.25, 16, 16);
                const cheekMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color).offsetHSL(0, 0.1, 0.1),
                    roughness: 0.95
                });
                const leftCheek = new THREE.Mesh(cheekGeo, cheekMaterial);
                leftCheek.position.set(-0.35, 0.35, 0.85);
                leftCheek.scale.set(1.1, 0.9, 0.8);
                leftCheek.castShadow = true;
                group.add(leftCheek);

                const rightCheek = new THREE.Mesh(cheekGeo, cheekMaterial);
                rightCheek.position.set(0.35, 0.35, 0.85);
                rightCheek.scale.set(1.1, 0.9, 0.8);
                rightCheek.castShadow = true;
                group.add(rightCheek);

                // Tiny whiskers
                const hamsterWhiskerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF,
                    roughness: 0.2
                });
                const hamsterWhiskerGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.35, 4);

                for (let i = 0; i < 3; i++) {
                    const whisker = new THREE.Mesh(hamsterWhiskerGeo, hamsterWhiskerMaterial);
                    whisker.position.set(-0.25, 0.38 + i * 0.03, 1.15);
                    whisker.rotation.set(0, 0, Math.PI / 2 + (i - 1) * 0.1);
                    group.add(whisker);

                    const whisker2 = new THREE.Mesh(hamsterWhiskerGeo, hamsterWhiskerMaterial);
                    whisker2.position.set(0.25, 0.38 + i * 0.03, 1.15);
                    whisker2.rotation.set(0, 0, Math.PI / 2 - (i - 1) * 0.1);
                    group.add(whisker2);
                }

                // Tiny front teeth
                const hamsterToothGeo = new THREE.BoxGeometry(0.04, 0.08, 0.03);
                const hamsterToothMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFF0,
                    roughness: 0.2
                });
                const hamsterLeftTooth = new THREE.Mesh(hamsterToothGeo, hamsterToothMaterial);
                hamsterLeftTooth.position.set(-0.03, 0.32, 1.12);
                group.add(hamsterLeftTooth);

                const hamsterRightTooth = new THREE.Mesh(hamsterToothGeo, hamsterToothMaterial);
                hamsterRightTooth.position.set(0.03, 0.32, 1.12);
                group.add(hamsterRightTooth);

                break;
        }
    }

    getBodyProportions(animalType) {
        switch(animalType) {
            case 'dog':
                return {
                    bodyScaleX: 1.4, bodyScaleY: 1.0, bodyScaleZ: 1.2,
                    bellySize: 0.8, bellyY: -0.3,
                    headSize: 0.75, headScaleX: 1.0, headScaleY: 1.1, headScaleZ: 1.0,
                    headY: 0.5, headZ: 1.2
                };
            case 'cat':
                return {
                    bodyScaleX: 1.3, bodyScaleY: 0.75, bodyScaleZ: 1.4,
                    bellySize: 0.7, bellyY: -0.22,
                    headSize: 0.58, headScaleX: 1.0, headScaleY: 0.9, headScaleZ: 0.85,
                    headY: 0.35, headZ: 1.15
                };
            case 'rabbit':
                return {
                    bodyScaleX: 1.2, bodyScaleY: 1.0, bodyScaleZ: 1.0,
                    bellySize: 0.75, bellyY: -0.35,
                    headSize: 0.7, headScaleX: 1.1, headScaleY: 1.2, headScaleZ: 1.0,
                    headY: 0.6, headZ: 1.0
                };
            case 'hamster':
                return {
                    bodyScaleX: 1.0, bodyScaleY: 0.85, bodyScaleZ: 0.95,
                    bellySize: 0.6, bellyY: -0.28,
                    headSize: 0.6, headScaleX: 1.05, headScaleY: 1.0, headScaleZ: 0.95,
                    headY: 0.45, headZ: 0.95
                };
            default:
                return {
                    bodyScaleX: 1.3, bodyScaleY: 0.9, bodyScaleZ: 1.1,
                    bellySize: 0.7, bellyY: -0.3,
                    headSize: 0.75, headScaleX: 0.9, headScaleY: 1.0, headScaleZ: 1.0,
                    headY: 0.5, headZ: 1.1
                };
        }
    }

    getLegConfig(animalType) {
        switch(animalType) {
            case 'dog':
                return { topRadius: 0.15, bottomRadius: 0.12, length: 0.7, yPos: -0.6 };
            case 'cat':
                return { topRadius: 0.11, bottomRadius: 0.08, length: 0.65, yPos: -0.55 };
            case 'rabbit':
                return { topRadius: 0.18, bottomRadius: 0.15, length: 0.5, yPos: -0.65 };
            case 'hamster':
                return { topRadius: 0.10, bottomRadius: 0.08, length: 0.4, yPos: -0.7 };
            default:
                return { topRadius: 0.15, bottomRadius: 0.12, length: 0.6, yPos: -0.6 };
        }
    }

    addTail(group, animalType, bodyMaterial) {
        let tailGeometry, tail;
        switch(animalType) {
            case 'dog':
                tailGeometry = new THREE.CylinderGeometry(0.12, 0.08, 1.2, 12);
                tail = new THREE.Mesh(tailGeometry, bodyMaterial);
                tail.position.set(0, 0.3, -1.2);
                tail.rotation.x = Math.PI / 4;
                break;

            case 'cat':
                // Create multi-segment fluffy tail
                const tailGroup = new THREE.Group();
                const numSegments = 8;
                for (let i = 0; i < numSegments; i++) {
                    const segmentRadius = 0.12 - (i * 0.012);
                    const segmentGeometry = new THREE.SphereGeometry(segmentRadius, 12, 12);
                    segmentGeometry.scale(1, 1, 1.5);
                    const segment = new THREE.Mesh(segmentGeometry, bodyMaterial);
                    segment.position.set(0, -i * 0.2, 0);
                    segment.castShadow = true;
                    tailGroup.add(segment);
                }

                // Position and curve the tail upward
                tailGroup.position.set(0, 0.1, -1.2);
                tailGroup.rotation.x = Math.PI / 6;
                tailGroup.name = 'tail';
                group.add(tailGroup);
                return; // Exit early since we added the tail directly

            case 'rabbit':
                tailGeometry = new THREE.SphereGeometry(0.2, 16, 16);
                tail = new THREE.Mesh(tailGeometry, bodyMaterial);
                tail.position.set(0, -0.1, -1.1);
                tail.scale.set(1, 0.8, 0.8);
                break;

            case 'hamster':
                tailGeometry = new THREE.CylinderGeometry(0.05, 0.03, 0.3, 8);
                tail = new THREE.Mesh(tailGeometry, bodyMaterial);
                tail.position.set(0, 0.1, -1.0);
                tail.rotation.x = Math.PI / 2.5;
                break;
        }
        tail.castShadow = true;
        group.add(tail);
    }

    createAnimals() {
        const animalTypes = [
            { name: 'Buddy the Dog', color: 0xd2691e, type: 'dog', pos: { x: -8, z: 5 } },
            { name: 'Whiskers the Cat', color: 0xff7f50, type: 'cat', pos: { x: 8, z: 5 } },
            { name: 'Fluffy the Rabbit', color: 0xffffff, type: 'rabbit', pos: { x: -8, z: -5 } },
            { name: 'Nibbles the Hamster', color: 0xffd700, type: 'hamster', pos: { x: 8, z: -5 } }
        ];

        animalTypes.forEach((type, index) => {
            const animal = this.createAnimal(type.name, type.color, type.type, type.pos);
            this.animals.push(animal);
        });
    }

    createAnimal(name, color, animalType, position) {
        const group = new THREE.Group();

        const bodyProportions = this.getBodyProportions(animalType);

        const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
        bodyGeometry.scale(bodyProportions.bodyScaleX, bodyProportions.bodyScaleY, bodyProportions.bodyScaleZ);

        // Enhanced realistic fur material
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.92,
            metalness: 0.0,
            flatShading: false
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.name = 'body';
        group.add(body);

        const bellyGeometry = new THREE.SphereGeometry(bodyProportions.bellySize, 32, 32);
        bellyGeometry.scale(1, 0.8, 0.9);
        const belly = new THREE.Mesh(bellyGeometry, new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).offsetHSL(0, -0.2, 0.3),
            roughness: 0.96,
            metalness: 0.0
        }));
        belly.position.set(0, bodyProportions.bellyY, 0.3);
        belly.castShadow = true;
        belly.receiveShadow = true;
        belly.name = 'belly';
        group.add(belly);

        const headGeometry = new THREE.SphereGeometry(bodyProportions.headSize, 32, 32);
        headGeometry.scale(bodyProportions.headScaleX, bodyProportions.headScaleY, bodyProportions.headScaleZ);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, bodyProportions.headY, bodyProportions.headZ);
        head.castShadow = true;
        head.name = 'head';
        group.add(head);

        const snoutGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        snoutGeometry.scale(0.7, 0.6, 1);
        const snout = new THREE.Mesh(snoutGeometry, new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).offsetHSL(0, -0.1, 0.2),
            roughness: 0.95
        }));
        snout.position.set(0, bodyProportions.headY - 0.25, bodyProportions.headZ + 0.4);
        snout.castShadow = true;
        group.add(snout);

        // Create eyes based on animal type
        if (animalType === 'cat') {
            // Cat eyes with slit pupils
            const catEyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const catEyeMaterial = new THREE.MeshStandardMaterial({
                color: 0x88DD44,
                emissive: 0x224411,
                emissiveIntensity: 0.3,
                roughness: 0.2,
                metalness: 0.1
            });
            const leftCatEye = new THREE.Mesh(catEyeGeometry, catEyeMaterial);
            leftCatEye.position.set(-0.35, bodyProportions.headY + 0.15, bodyProportions.headZ + 0.5);
            leftCatEye.scale.set(0.8, 1, 1);
            group.add(leftCatEye);

            const rightCatEye = new THREE.Mesh(catEyeGeometry, catEyeMaterial);
            rightCatEye.position.set(0.35, bodyProportions.headY + 0.15, bodyProportions.headZ + 0.5);
            rightCatEye.scale.set(0.8, 1, 1);
            group.add(rightCatEye);

            // Vertical slit pupils
            const slitGeometry = new THREE.BoxGeometry(0.02, 0.18, 0.02);
            const slitMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });

            const leftSlit = new THREE.Mesh(slitGeometry, slitMaterial);
            leftSlit.position.set(-0.35, bodyProportions.headY + 0.15, bodyProportions.headZ + 0.58);
            group.add(leftSlit);

            const rightSlit = new THREE.Mesh(slitGeometry, slitMaterial);
            rightSlit.position.set(0.35, bodyProportions.headY + 0.15, bodyProportions.headZ + 0.58);
            group.add(rightSlit);

            // Eye shine/reflection
            const shineGeometry = new THREE.SphereGeometry(0.03, 8, 8);
            const shineMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
                emissive: 0xFFFFFF,
                emissiveIntensity: 0.8,
                roughness: 0.0
            });

            const leftShine = new THREE.Mesh(shineGeometry, shineMaterial);
            leftShine.position.set(-0.38, bodyProportions.headY + 0.22, bodyProportions.headZ + 0.6);
            group.add(leftShine);

            const rightShine = new THREE.Mesh(shineGeometry, shineMaterial);
            rightShine.position.set(0.32, bodyProportions.headY + 0.22, bodyProportions.headZ + 0.6);
            group.add(rightShine);
        } else {
            // Regular round eyes for other animals
            const eyeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
            const eyeWhiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
            const leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
            leftEyeWhite.position.set(-0.3, bodyProportions.headY + 0.2, bodyProportions.headZ + 0.45);
            group.add(leftEyeWhite);
            const rightEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
            rightEyeWhite.position.set(0.3, bodyProportions.headY + 0.2, bodyProportions.headZ + 0.45);
            group.add(rightEyeWhite);

            const pupilGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });
            const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
            leftPupil.position.set(-0.3, bodyProportions.headY + 0.2, bodyProportions.headZ + 0.55);
            group.add(leftPupil);
            const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
            rightPupil.position.set(0.3, bodyProportions.headY + 0.2, bodyProportions.headZ + 0.55);
            group.add(rightPupil);
        }

        // Create nose based on animal type
        if (animalType === 'cat') {
            // Pink triangular cat nose
            const catNoseGeometry = new THREE.ConeGeometry(0.08, 0.12, 3);
            const catNoseMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFB6C1,
                roughness: 0.3,
                metalness: 0.1
            });
            const catNose = new THREE.Mesh(catNoseGeometry, catNoseMaterial);
            catNose.position.set(0, bodyProportions.headY - 0.12, bodyProportions.headZ + 0.68);
            catNose.rotation.x = Math.PI;
            catNose.castShadow = true;
            group.add(catNose);

            // Nostrils
            const nostrilGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            const nostrilMaterial = new THREE.MeshStandardMaterial({ color: 0x331111, roughness: 0.8 });

            const leftNostril = new THREE.Mesh(nostrilGeometry, nostrilMaterial);
            leftNostril.position.set(-0.03, bodyProportions.headY - 0.18, bodyProportions.headZ + 0.68);
            group.add(leftNostril);

            const rightNostril = new THREE.Mesh(nostrilGeometry, nostrilMaterial);
            rightNostril.position.set(0.03, bodyProportions.headY - 0.18, bodyProportions.headZ + 0.68);
            group.add(rightNostril);
        } else {
            // Regular nose for other animals
            const noseGeometry = new THREE.SphereGeometry(0.12, 16, 16);
            const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.1 });
            const nose = new THREE.Mesh(noseGeometry, noseMaterial);
            nose.position.set(0, bodyProportions.headY - 0.15, bodyProportions.headZ + 0.65);
            group.add(nose);
        }

        this.addSpeciesFeatures(group, animalType, bodyMaterial, color);

        const legConfig = this.getLegConfig(animalType);
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(legConfig.topRadius, legConfig.bottomRadius, legConfig.length, 12);
            const leg = new THREE.Mesh(legGeometry, bodyMaterial);
            leg.position.set(
                i % 2 === 0 ? -0.5 : 0.5,
                legConfig.yPos,
                i < 2 ? 0.4 : -0.4
            );
            leg.castShadow = true;
            group.add(leg);

            const paw = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 12, 12),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color(color).offsetHSL(0, -0.2, 0.1),
                    roughness: 0.9
                })
            );
            paw.scale.set(1, 0.5, 1);
            paw.position.set(
                i % 2 === 0 ? -0.5 : 0.5,
                legConfig.yPos - legConfig.length / 2,
                i < 2 ? 0.4 : -0.4
            );
            paw.castShadow = true;
            group.add(paw);
        }

        this.addTail(group, animalType, bodyMaterial);

        group.position.set(position.x, 1.1, position.z);

        const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x90ee90,
            roughness: 0.6
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(position.x, 0.1, position.z);
        platform.receiveShadow = true;
        this.scene.add(platform);

        this.scene.add(group);

        return {
            name: name,
            mesh: group,
            platform: platform,
            platformCenter: { x: position.x, z: position.z },
            baseColor: color,
            stats: {
                happiness: 100,
                hunger: 0,
                cleanliness: 100
            },
            animations: {
                bobPhase: Math.random() * Math.PI * 2,
                tailWag: 0,
                walkCycle: 0,
                legPhase: Math.random() * Math.PI * 2
            },
            movement: {
                targetX: position.x,
                targetZ: position.z,
                speed: 0.02 + Math.random() * 0.02,
                isWalking: false,
                nextMoveTime: Date.now() + Math.random() * 5000,
                idleTime: 2000 + Math.random() * 3000
            },
            dirtParticles: []
        };
    }

    setupLights() {
        // Enhanced ambient light for realistic base illumination
        const ambientLight = new THREE.AmbientLight(0xF5F5DC, 0.4);
        this.scene.add(ambientLight);

        // Main sun/window light - stronger and warmer
        const sunLight = new THREE.DirectionalLight(0xFFFAF0, 1.5);
        sunLight.position.set(20, 30, 20);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -35;
        sunLight.shadow.camera.right = 35;
        sunLight.shadow.camera.top = 35;
        sunLight.shadow.camera.bottom = -35;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.bias = -0.00015;
        sunLight.shadow.radius = 2;
        this.scene.add(sunLight);

        // Soft fill light from opposite direction
        const fillLight = new THREE.DirectionalLight(0xB0C4DE, 0.4);
        fillLight.position.set(-15, 15, -15);
        this.scene.add(fillLight);

        // Multiple ceiling lights for realistic indoor lighting
        const ceilingLightPositions = [
            { x: -15, z: -15 },
            { x: 0, z: -15 },
            { x: 15, z: -15 },
            { x: -15, z: 0 },
            { x: 0, z: 0 },
            { x: 15, z: 0 },
            { x: -15, z: 15 },
            { x: 0, z: 15 },
            { x: 15, z: 15 }
        ];

        ceilingLightPositions.forEach(pos => {
            const ceilingLight = new THREE.PointLight(0xFFFAE6, 0.5, 18);
            ceilingLight.position.set(pos.x, 9, pos.z);
            ceilingLight.castShadow = true;
            ceilingLight.shadow.mapSize.width = 1024;
            ceilingLight.shadow.mapSize.height = 1024;
            ceilingLight.shadow.bias = -0.0005;
            this.scene.add(ceilingLight);
        });

        // Accent spotlights on animal platforms
        const animalPositions = [
            { x: -8, z: 5 },
            { x: 8, z: 5 },
            { x: -8, z: -5 },
            { x: 8, z: -5 }
        ];

        animalPositions.forEach(pos => {
            const spotLight = new THREE.SpotLight(0xFFFFFF, 0.6, 15, Math.PI / 8, 0.3);
            spotLight.position.set(pos.x, 8, pos.z);
            spotLight.target.position.set(pos.x, 0, pos.z);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 2048;
            spotLight.shadow.mapSize.height = 2048;
            this.scene.add(spotLight);
            this.scene.add(spotLight.target);
        });

        // Hemisphere light for realistic sky/ground bounce
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x8B7355, 0.3);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());

        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        const canvas = document.getElementById('game-canvas');
        canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.lastMouseX = e.clientX;
        });

        canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (this.mouseDown) {
                const deltaX = e.clientX - this.lastMouseX;
                this.cameraAngle -= deltaX * 0.01;
                this.lastMouseX = e.clientX;
            }
        });

        canvas.addEventListener('click', (e) => this.onCanvasClick(e));

        window.addEventListener('wheel', (e) => {
            this.cameraDistance = Math.max(8, Math.min(25, this.cameraDistance + e.deltaY * 0.01));
        });
    }

    onCanvasClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const meshes = this.animals.map(a => a.mesh);
        const intersects = raycaster.intersectObjects(meshes, true);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const animal = this.animals.find(a => a.mesh.children.includes(clickedMesh) || a.mesh === clickedMesh.parent);

            if (animal) {
                this.selectAnimal(animal);
            }
        }
    }

    selectAnimal(animal) {
        this.selectedAnimal = animal;
        document.getElementById('stats-panel').style.display = 'block';
        document.getElementById('action-menu').style.display = 'flex';
        document.getElementById('pet-name').textContent = animal.name;
        this.updateStatsUI();
    }

    closeActionMenu() {
        document.getElementById('action-menu').style.display = 'none';
        document.getElementById('stats-panel').style.display = 'none';
        this.selectedAnimal = null;
    }

    updateStatsUI() {
        if (!this.selectedAnimal) return;

        const stats = this.selectedAnimal.stats;

        document.getElementById('happiness-bar').style.width = stats.happiness + '%';
        document.getElementById('happiness-text').textContent = Math.round(stats.happiness) + '%';

        document.getElementById('hunger-bar').style.width = stats.hunger + '%';
        document.getElementById('hunger-text').textContent = Math.round(stats.hunger) + '%';

        document.getElementById('clean-bar').style.width = stats.cleanliness + '%';
        document.getElementById('clean-text').textContent = Math.round(stats.cleanliness) + '%';
    }

    showNotification(emoji) {
        const notification = document.getElementById('notification');
        notification.textContent = emoji;
        notification.className = 'notification show';

        setTimeout(() => {
            notification.className = 'notification';
        }, 1000);
    }

    petAnimal() {
        if (!this.selectedAnimal) return;

        this.selectedAnimal.stats.happiness = Math.min(100, this.selectedAnimal.stats.happiness + 10);
        this.updateStatsUI();
        this.showNotification('❤️');
        this.animateAnimal(this.selectedAnimal, 'bounce');
    }

    feedAnimal() {
        if (!this.selectedAnimal) return;

        if (this.selectedAnimal.stats.hunger > 5) {
            this.selectedAnimal.stats.hunger = Math.max(0, this.selectedAnimal.stats.hunger - 30);
            this.selectedAnimal.stats.happiness = Math.min(100, this.selectedAnimal.stats.happiness + 5);
            this.updateStatsUI();
            this.showNotification('🍖');
            this.animateAnimal(this.selectedAnimal, 'grow');
        } else {
            this.showNotification('😊');
        }
    }

    washAnimal() {
        if (!this.selectedAnimal) return;

        if (this.selectedAnimal.stats.cleanliness < 90) {
            this.selectedAnimal.stats.cleanliness = 100;
            this.selectedAnimal.stats.happiness = Math.min(100, this.selectedAnimal.stats.happiness + 3);
            this.updateStatsUI();
            this.showNotification('✨');
            this.animateAnimal(this.selectedAnimal, 'spin');
        } else {
            this.showNotification('💧');
        }
    }

    playWithAnimal() {
        if (!this.selectedAnimal) return;

        this.selectedAnimal.stats.happiness = Math.min(100, this.selectedAnimal.stats.happiness + 15);
        this.selectedAnimal.stats.hunger = Math.min(100, this.selectedAnimal.stats.hunger + 5);
        this.selectedAnimal.stats.cleanliness = Math.max(0, this.selectedAnimal.stats.cleanliness - 10);
        this.updateStatsUI();
        this.showNotification('⚽');
        this.animateAnimal(this.selectedAnimal, 'jump');

        this.showPlayVideo();
    }

    showPlayVideo() {
        if (!this.selectedAnimal) return;

        const videoOverlay = document.getElementById('video-overlay');
        const canvas = document.getElementById('animation-canvas');
        const ctx = canvas.getContext('2d');

        const animalTypes = ['dog', 'cat', 'rabbit', 'hamster'];
        let animalType = 'dog';

        for (let type of animalTypes) {
            if (this.selectedAnimal.name.toLowerCase().includes(type)) {
                animalType = type;
                break;
            }
        }

        videoOverlay.style.display = 'flex';

        // For dogs, use interactive ball throwing game
        if (animalType === 'dog') {
            this.startInteractiveDogGame(canvas, ctx);
        } else if (animalType === 'cat') {
            // For cats, use interactive mouse toy game
            this.startInteractiveCatGame(canvas, ctx);
        } else {
            // For other animals, use animated scenes
            this.animationStartTime = Date.now();
            this.animationRunning = true;
            this.animatePlayScene(ctx, animalType);

            setTimeout(() => {
                this.closeVideo();
            }, 30000);
        }
    }

    startInteractiveDogGame(canvas, ctx) {
        // Initialize ball throwing game state
        this.ballGame = {
            ball: {
                x: canvas.width / 2,
                y: canvas.height - 100,
                vx: 0,
                vy: 0,
                radius: 20,
                isDragging: false,
                isThrown: false
            },
            dog: {
                x: 150,
                y: canvas.height - 150,
                targetX: 150,
                speed: 3,
                hasBall: false
            },
            dragStart: { x: 0, y: 0 },
            score: 0
        };

        // Mouse event handlers for ball throwing
        const mouseDownHandler = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

            const ball = this.ballGame.ball;
            const dist = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);

            if (dist < ball.radius && !ball.isThrown) {
                ball.isDragging = true;
                this.ballGame.dragStart = { x: mouseX, y: mouseY };
            }
        };

        const mouseMoveHandler = (e) => {
            if (!this.ballGame.ball.isDragging) return;

            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

            // Show trajectory line
            this.ballGame.currentMouse = { x: mouseX, y: mouseY };
        };

        const mouseUpHandler = (e) => {
            if (!this.ballGame.ball.isDragging) return;

            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

            const ball = this.ballGame.ball;
            ball.isDragging = false;

            // Calculate throw velocity based on flick
            const dx = mouseX - this.ballGame.dragStart.x;
            const dy = mouseY - this.ballGame.dragStart.y;

            ball.vx = dx * 0.3;
            ball.vy = dy * 0.3;
            ball.isThrown = true;

            this.ballGame.currentMouse = null;
        };

        canvas.addEventListener('mousedown', mouseDownHandler);
        canvas.addEventListener('mousemove', mouseMoveHandler);
        canvas.addEventListener('mouseup', mouseUpHandler);

        // Store handlers for cleanup
        this.ballGameHandlers = { mouseDownHandler, mouseMoveHandler, mouseUpHandler };

        // Start game loop
        this.animationRunning = true;
        this.animateInteractiveDogGame(canvas, ctx);
    }

    animateInteractiveDogGame(canvas, ctx) {
        if (!this.animationRunning) return;

        const game = this.ballGame;
        const ball = game.ball;
        const dog = game.dog;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw field background
        this.drawFieldBackground(ctx, canvas);

        // Update ball physics
        if (ball.isThrown) {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += 0.5; // gravity

            // Bounce off walls
            if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                ball.vx *= -0.7;
                ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
            }

            // Ground bounce
            if (ball.y + ball.radius > canvas.height - 100) {
                ball.y = canvas.height - 100 - ball.radius;
                ball.vy *= -0.6;
                ball.vx *= 0.8;

                if (Math.abs(ball.vy) < 1) {
                    ball.vy = 0;
                    ball.vx *= 0.9;
                }
            }

            // Check if dog caught the ball
            const dogDist = Math.sqrt((ball.x - dog.x) ** 2 + (ball.y - dog.y) ** 2);
            if (dogDist < 60 && !dog.hasBall) {
                dog.hasBall = true;
                ball.isThrown = false;
                game.score++;

                // Dog returns ball
                setTimeout(() => {
                    ball.x = canvas.width / 2;
                    ball.y = canvas.height - 100;
                    ball.vx = 0;
                    ball.vy = 0;
                    dog.hasBall = false;
                    dog.targetX = 150;
                }, 2000);
            }
        }

        // Update dog AI
        if (ball.isThrown && !dog.hasBall) {
            dog.targetX = ball.x;
        }

        if (Math.abs(dog.x - dog.targetX) > 5) {
            dog.x += (dog.targetX - dog.x) * 0.05;
        }

        // Draw ground
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

        // Draw dog
        this.drawInteractiveDog(ctx, dog.x, dog.y, dog.hasBall);

        // Draw ball
        if (!dog.hasBall) {
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();

            // Highlight/glow effect
            ctx.strokeStyle = ball.isDragging ? '#FFFF00' : '#AA0000';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw trajectory line when dragging
            if (ball.isDragging && this.ballGame.currentMouse) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(ball.x, ball.y);
                ctx.lineTo(this.ballGame.currentMouse.x, this.ballGame.currentMouse.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Draw instructions and score
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Click and flick the red ball!', 20, 40);
        ctx.fillText(`Throws: ${game.score}`, 20, 70);

        requestAnimationFrame(() => this.animateInteractiveDogGame(canvas, ctx));
    }

    drawFieldBackground(ctx, canvas) {
        // Sky
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height - 100);

        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(700, 80, 40, 0, Math.PI * 2);
        ctx.fill();

        // Grass texture
        ctx.fillStyle = '#2E7D32';
        for (let i = 0; i < canvas.width; i += 15) {
            const grassHeight = 8 + Math.random() * 4;
            ctx.fillRect(i, canvas.height - 100 - grassHeight, 2, grassHeight);
        }
    }

    drawInteractiveDog(ctx, x, y, hasBall) {
        // Dog body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 40, y - 20, 80, 40);

        // Dog head
        ctx.beginPath();
        ctx.arc(x + 40, y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillRect(x + 30, y - 30, 10, 20);
        ctx.fillRect(x + 50, y - 30, 10, 20);

        // Eye
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(x + 50, y - 5, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + 50, y - 5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - 30, y + 15, 10, 30);
        ctx.fillRect(x - 10, y + 15, 10, 30);
        ctx.fillRect(x + 10, y + 15, 10, 30);
        ctx.fillRect(x + 30, y + 15, 10, 30);

        // Tail wagging
        const tailWag = Math.sin(Date.now() * 0.01) * 10;
        ctx.fillStyle = '#8B4513';
        ctx.save();
        ctx.translate(x - 40, y);
        ctx.rotate(tailWag * Math.PI / 180);
        ctx.fillRect(-15, -5, 20, 10);
        ctx.restore();

        // If dog has ball, show it in mouth
        if (hasBall) {
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(x + 55, y + 5, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    startInteractiveCatGame(canvas, ctx) {
        // Initialize cat toy game state
        this.catGame = {
            toy: {
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: 15,
                stickLength: 100
            },
            cat: {
                x: 200,
                y: canvas.height - 150,
                targetX: 200,
                targetY: canvas.height - 150,
                speed: 4,
                isJumping: false,
                jumpTime: 0
            },
            mouse: {
                x: canvas.width / 2,
                y: canvas.height / 2
            },
            pounces: 0
        };

        // Mouse event handlers for moving the toy
        const mouseMoveHandler = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

            // Update toy position to follow mouse
            this.catGame.toy.x = mouseX;
            this.catGame.toy.y = mouseY;
            this.catGame.mouse.x = mouseX;
            this.catGame.mouse.y = mouseY;
        };

        canvas.addEventListener('mousemove', mouseMoveHandler);

        // Store handler for cleanup
        this.catGameHandlers = { mouseMoveHandler };

        // Start game loop
        this.animationRunning = true;
        this.animateInteractiveCatGame(canvas, ctx);
    }

    animateInteractiveCatGame(canvas, ctx) {
        if (!this.animationRunning) return;

        const game = this.catGame;
        const toy = game.toy;
        const cat = game.cat;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw field background
        this.drawFieldBackground(ctx, canvas);

        // Update cat AI - chase the toy
        const dx = toy.x - cat.x;
        const dy = toy.y - cat.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 30) {
            cat.targetX = toy.x;
            cat.targetY = toy.y;

            // Move cat towards target
            const moveX = (cat.targetX - cat.x) * 0.08;
            const moveY = (cat.targetY - cat.y) * 0.08;

            cat.x += moveX;
            cat.y += moveY;
        } else {
            // Cat is close - pounce!
            if (!cat.isJumping && Math.random() > 0.97) {
                cat.isJumping = true;
                cat.jumpTime = 0;
                game.pounces++;
            }
        }

        // Update jump animation
        if (cat.isJumping) {
            cat.jumpTime += 0.1;
            if (cat.jumpTime > Math.PI) {
                cat.isJumping = false;
                cat.jumpTime = 0;
            }
        }

        // Draw ground
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

        // Draw stick (from bottom of screen to toy)
        const stickStartX = game.mouse.x;
        const stickStartY = 0; // Top of screen

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(stickStartX, stickStartY);
        ctx.lineTo(toy.x, toy.y);
        ctx.stroke();

        // Draw toy mouse at end of stick
        this.drawToyMouse(ctx, toy.x, toy.y);

        // Draw string/feather effect
        ctx.strokeStyle = '#DEB887';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const offset = Math.sin(Date.now() * 0.01 + i) * 10;
            ctx.beginPath();
            ctx.moveTo(toy.x, toy.y);
            ctx.lineTo(toy.x + offset, toy.y + 20 + i * 10);
            ctx.stroke();
        }

        // Draw cat
        const jumpHeight = cat.isJumping ? Math.sin(cat.jumpTime) * 40 : 0;
        this.drawInteractiveCat(ctx, cat.x, cat.y - jumpHeight);

        // Draw instructions and score
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Move your mouse to play with the cat!', 20, 40);
        ctx.fillText(`Pounces: ${game.pounces}`, 20, 70);

        requestAnimationFrame(() => this.animateInteractiveCatGame(canvas, ctx));
    }

    drawToyMouse(ctx, x, y) {
        // Toy mouse body
        ctx.fillStyle = '#A9A9A9';
        ctx.beginPath();
        ctx.ellipse(x, y, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mouse head
        ctx.beginPath();
        ctx.arc(x + 10, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pink ears
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(x + 8, y - 6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 14, y - 6, 4, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + 13, y - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(x + 16, y, 1, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#A9A9A9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 12, y);
        const tailWiggle = Math.sin(Date.now() * 0.02) * 5;
        ctx.quadraticCurveTo(x - 20, y + tailWiggle, x - 25, y + 5);
        ctx.stroke();
    }

    drawInteractiveCat(ctx, x, y) {
        // Cat body
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(x - 35, y - 15, 70, 35);

        // Cat head
        ctx.beginPath();
        ctx.arc(x + 35, y, 22, 0, Math.PI * 2);
        ctx.fill();

        // Cat ears (triangular)
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(x + 25, y - 15);
        ctx.lineTo(x + 20, y - 25);
        ctx.lineTo(x + 30, y - 18);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 45, y - 15);
        ctx.lineTo(x + 40, y - 25);
        ctx.lineTo(x + 50, y - 18);
        ctx.closePath();
        ctx.fill();

        // Pink inner ears
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(x + 25, y - 15);
        ctx.lineTo(x + 23, y - 20);
        ctx.lineTo(x + 28, y - 17);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 45, y - 15);
        ctx.lineTo(x + 42, y - 20);
        ctx.lineTo(x + 47, y - 17);
        ctx.closePath();
        ctx.fill();

        // Cat eyes (green with slits)
        ctx.fillStyle = '#88DD44';
        ctx.beginPath();
        ctx.ellipse(x + 30, y - 3, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + 42, y - 3, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Slit pupils
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 29, y - 6, 2, 6);
        ctx.fillRect(x + 41, y - 6, 2, 6);

        // Eye shine
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(x + 31, y - 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 43, y - 5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Pink nose
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(x + 36, y + 5);
        ctx.lineTo(x + 34, y + 8);
        ctx.lineTo(x + 38, y + 8);
        ctx.closePath();
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 1.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(x + 36, y + 3 + i * 3);
            ctx.lineTo(x + 55, y + i * 4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + 36, y + 3 + i * 3);
            ctx.lineTo(x + 17, y + i * 4);
            ctx.stroke();
        }

        // Legs
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(x - 25, y + 15, 10, 25);
        ctx.fillRect(x - 5, y + 15, 10, 25);
        ctx.fillRect(x + 15, y + 15, 10, 25);
        ctx.fillRect(x + 35, y + 15, 10, 25);

        // Tail (curved and animated)
        const tailWag = Math.sin(Date.now() * 0.008) * 15;
        ctx.fillStyle = '#FF8C00';
        ctx.save();
        ctx.translate(x - 35, y);
        ctx.rotate((tailWag + 30) * Math.PI / 180);
        ctx.fillRect(-25, -5, 30, 10);
        ctx.restore();

        // Stripes
        ctx.fillStyle = 'rgba(139, 69, 19, 0.4)';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(x - 30 + i * 15, y - 12, 8, 25);
        }
    }

    animatePlayScene(ctx, animalType) {
        if (!this.animationRunning) return;

        const elapsed = (Date.now() - this.animationStartTime) / 1000;
        const canvas = ctx.canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sky with realistic gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(0.5, '#B0E0E6');
        skyGradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(700, 80, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(700, 80, 35, 0, Math.PI * 2);
        ctx.fill();

        // Sun rays
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(700 + Math.cos(angle) * 45, 80 + Math.sin(angle) * 45);
            ctx.lineTo(700 + Math.cos(angle) * 65, 80 + Math.sin(angle) * 65);
            ctx.stroke();
        }

        // Clouds
        this.drawCloud(ctx, 100 + elapsed * 10, 100, 60);
        this.drawCloud(ctx, 400 + elapsed * 15, 150, 80);
        this.drawCloud(ctx, 600 + elapsed * 8, 120, 70);

        // Ground with texture
        const groundGradient = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
        groundGradient.addColorStop(0, '#8B7355');
        groundGradient.addColorStop(1, '#654321');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

        // Grass layer with detail
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 120, canvas.width, 20);

        // Grass blades
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (let i = 0; i < canvas.width; i += 20) {
            const grassHeight = 10 + Math.sin(i * 0.1 + elapsed) * 3;
            ctx.beginPath();
            ctx.moveTo(i, canvas.height - 120);
            ctx.lineTo(i + 2, canvas.height - 120 - grassHeight);
            ctx.stroke();
        }

        // Flowers
        for (let i = 100; i < canvas.width; i += 150) {
            this.drawFlower(ctx, i, canvas.height - 125, elapsed);
        }

        switch(animalType) {
            case 'dog':
                this.animateDogPlay(ctx, elapsed);
                break;
            case 'cat':
                this.animateCatPlay(ctx, elapsed);
                break;
            case 'rabbit':
                this.animateRabbitPlay(ctx, elapsed);
                break;
            case 'hamster':
                this.animateHamsterPlay(ctx, elapsed);
                break;
        }

        requestAnimationFrame(() => this.animatePlayScene(ctx, animalType));
    }

    drawCloud(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
        ctx.arc(x + size * 0.7, y, size * 0.45, 0, Math.PI * 2);
        ctx.arc(x + size * 0.9, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y + size * 0.1, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFlower(ctx, x, y, time) {
        // Stem
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(time * 2) * 2, y - 15);
        ctx.stroke();

        // Petals
        const petalColors = ['#FF1493', '#FFD700', '#FF69B4', '#FFA500'];
        const flowerColor = petalColors[Math.floor(x / 150) % petalColors.length];
        ctx.fillStyle = flowerColor;
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(
                x + Math.cos(angle) * 5 + Math.sin(time * 2) * 2,
                y - 15 + Math.sin(angle) * 5,
                4, 6, angle, 0, Math.PI * 2
            );
            ctx.fill();
        }

        // Center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + Math.sin(time * 2) * 2, y - 15, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawRealisticPerson(ctx, x, y, time, pose) {
        // Skin tones with shading
        const skinTone = '#FDBCB4';
        const skinShadow = '#E3A898';
        const hairColor = '#4A3426';

        // Head with shading
        ctx.fillStyle = skinTone;
        ctx.beginPath();
        ctx.ellipse(x, y, 25, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head shadow (left side)
        const shadowGradient = ctx.createRadialGradient(x - 10, y, 0, x, y, 25);
        shadowGradient.addColorStop(0, 'rgba(227, 168, 152, 0.3)');
        shadowGradient.addColorStop(1, 'rgba(227, 168, 152, 0)');
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.ellipse(x, y, 25, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hair with more detail
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.ellipse(x, y - 10, 27, 22, 0, 0, Math.PI);
        ctx.fill();

        // Hair strands
        ctx.strokeStyle = hairColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (let i = -3; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * 7, y - 28);
            ctx.lineTo(x + i * 7 + 2, y - 20);
            ctx.stroke();
        }

        // Ears
        ctx.fillStyle = skinTone;
        ctx.beginPath();
        ctx.ellipse(x - 23, y, 8, 12, 0.3, 0, Math.PI * 2);
        ctx.ellipse(x + 23, y, 8, 12, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Eyes with more detail
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(x - 10, y - 5, 6, 8, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 10, y - 5, 6, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Iris
        ctx.fillStyle = '#4A90E2';
        ctx.beginPath();
        ctx.arc(x - 10, y - 3, 4, 0, Math.PI * 2);
        ctx.arc(x + 10, y - 3, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pupils with light reflection
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - 10, y - 3, 2.5, 0, Math.PI * 2);
        ctx.arc(x + 10, y - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye reflections
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(x - 9, y - 5, 1.5, 0, Math.PI * 2);
        ctx.arc(x + 11, y - 5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyelashes
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x - 10 + i * 3 - 3, y - 10);
            ctx.lineTo(x - 10 + i * 3 - 3, y - 13);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 10 + i * 3 - 3, y - 10);
            ctx.lineTo(x + 10 + i * 3 - 3, y - 13);
            ctx.stroke();
        }

        // Eyebrows
        ctx.strokeStyle = hairColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 16, y - 15);
        ctx.quadraticCurveTo(x - 10, y - 17, x - 4, y - 16);
        ctx.moveTo(x + 4, y - 16);
        ctx.quadraticCurveTo(x + 10, y - 17, x + 16, y - 15);
        ctx.stroke();

        // Nose with more detail
        ctx.fillStyle = skinShadow;
        ctx.beginPath();
        ctx.moveTo(x, y + 2);
        ctx.lineTo(x - 4, y + 10);
        ctx.lineTo(x + 4, y + 10);
        ctx.closePath();
        ctx.fill();

        // Nostrils
        ctx.fillStyle = '#C89080';
        ctx.beginPath();
        ctx.ellipse(x - 2, y + 9, 2, 2, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 2, y + 9, 2, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mouth (smile) with teeth
        ctx.fillStyle = '#8B4545';
        ctx.beginPath();
        ctx.arc(x, y + 12, 8, 0.2, Math.PI - 0.2);
        ctx.fill();

        // Teeth
        ctx.fillStyle = '#FFF';
        ctx.fillRect(x - 6, y + 12, 3, 2);
        ctx.fillRect(x - 2, y + 12, 3, 2);
        ctx.fillRect(x + 2, y + 12, 3, 2);

        // Neck
        ctx.fillStyle = skinTone;
        ctx.fillRect(x - 12, y + 25, 24, 15);

        // Body (torso) with shading
        const shirtColor = pose === 'sitting' ? '#32CD32' : pose === 'holding' ? '#FF6347' : '#4169E1';
        ctx.fillStyle = shirtColor;
        ctx.beginPath();
        ctx.moveTo(x - 35, y + 40);
        ctx.lineTo(x + 35, y + 40);
        ctx.lineTo(x + 30, y + 110);
        ctx.lineTo(x - 30, y + 110);
        ctx.closePath();
        ctx.fill();

        // Shirt shading (left side darker)
        const shirtGradient = ctx.createLinearGradient(x - 35, y + 75, x + 35, y + 75);
        shirtGradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        shirtGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        shirtGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = shirtGradient;
        ctx.beginPath();
        ctx.moveTo(x - 35, y + 40);
        ctx.lineTo(x + 35, y + 40);
        ctx.lineTo(x + 30, y + 110);
        ctx.lineTo(x - 30, y + 110);
        ctx.closePath();
        ctx.fill();

        // Shirt collar with detail
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(x - 10, y + 40);
        ctx.lineTo(x - 15, y + 50);
        ctx.lineTo(x, y + 45);
        ctx.lineTo(x + 15, y + 50);
        ctx.lineTo(x + 10, y + 40);
        ctx.closePath();
        ctx.fill();

        // Collar shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Shirt buttons
        ctx.fillStyle = '#444';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x, y + 55 + i * 15, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Arms
        if (pose === 'throwing') {
            // Right arm extended (throwing)
            const throwAngle = Math.sin(time * 3) * 0.4;
            ctx.save();
            ctx.translate(x + 35, y + 50);
            ctx.rotate(-0.5 + throwAngle);
            ctx.fillStyle = shirtColor;
            ctx.fillRect(0, -8, 50, 16);
            // Hand
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(50, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Left arm down
            ctx.fillStyle = shirtColor;
            ctx.fillRect(x - 45, y + 50, 16, 50);
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(x - 37, y + 100, 10, 0, Math.PI * 2);
            ctx.fill();
        } else if (pose === 'holding') {
            // Both arms forward (holding)
            ctx.fillStyle = shirtColor;
            ctx.fillRect(x - 45, y + 50, 16, 40);
            ctx.fillRect(x + 29, y + 50, 16, 40);

            // Hands
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(x - 37, y + 90, 12, 0, Math.PI * 2);
            ctx.arc(x + 37, y + 90, 12, 0, Math.PI * 2);
            ctx.fill();
        } else if (pose === 'sitting') {
            // Arms reaching down (sitting, petting)
            ctx.save();
            ctx.translate(x - 35, y + 50);
            ctx.rotate(0.5);
            ctx.fillStyle = shirtColor;
            ctx.fillRect(0, -8, 45, 16);
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(45, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.translate(x + 35, y + 50);
            ctx.rotate(-0.5);
            ctx.fillStyle = shirtColor;
            ctx.fillRect(-45, -8, 45, 16);
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(-45, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            // Normal standing pose with string/toy
            const armSwing = Math.sin(time * 2) * 0.1;
            ctx.save();
            ctx.translate(x + 35, y + 50);
            ctx.rotate(-0.3 + armSwing);
            ctx.fillStyle = shirtColor;
            ctx.fillRect(0, -8, 50, 16);
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(50, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.fillStyle = shirtColor;
            ctx.fillRect(x - 45, y + 50, 16, 50);
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(x - 37, y + 100, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // Legs and pants
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x - 25, y + 110, 20, 60);
        ctx.fillRect(x + 5, y + 110, 20, 60);

        // Shoes
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.ellipse(x - 15, y + 173, 12, 8, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 15, y + 173, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    animateDogPlay(ctx, time) {
        const personX = 150;
        const personY = 280;

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Playing Fetch with Dog!', 250, 50);

        // Draw realistic person
        this.drawRealisticPerson(ctx, personX, personY, time, 'throwing');

        const armAngle = Math.sin(time * 3) * 0.5 + 0.5;

        const ballProgress = (time % 3) / 3;
        let ballX, ballY;
        if (ballProgress < 0.3) {
            ballX = personX + 40 + (ballProgress / 0.3) * 400;
            const arc = Math.sin(ballProgress / 0.3 * Math.PI);
            ballY = armY - arc * 150;
        } else {
            const returnProgress = (ballProgress - 0.3) / 0.7;
            ballX = personX + 440 - returnProgress * 200;
            ballY = 450;
        }

        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
        ctx.fill();

        const dogX = ballProgress < 0.3 ? personX + 100 : ballX - 50;
        const dogY = 400;
        const dogBounce = Math.abs(Math.sin(time * 5)) * 10;

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(dogX, dogY - dogBounce, 80, 40);
        ctx.beginPath();
        ctx.arc(dogX + 80, dogY - dogBounce + 20, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#654321';
        ctx.fillRect(dogX + 10, dogY + 35 - dogBounce, 10, 30);
        ctx.fillRect(dogX + 30, dogY + 35 - dogBounce, 10, 30);
        ctx.fillRect(dogX + 50, dogY + 35 - dogBounce, 10, 30);
        ctx.fillRect(dogX + 70, dogY + 35 - dogBounce, 10, 30);

        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(dogX + 90, dogY - dogBounce + 15, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(dogX + 90, dogY - dogBounce + 15, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    animateCatPlay(ctx, time) {
        const personX = 200;
        const personY = 280;

        ctx.fillStyle = '#FF69B4';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Playing with Cat!', 280, 50);

        // Draw realistic person
        this.drawRealisticPerson(ctx, personX, personY, time, 'standing');

        const toyAngle = time * 2;
        const toyX = personX + 120 + Math.cos(toyAngle) * 80;
        const toyY = personY + 20 + Math.sin(toyAngle) * 40;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(personX + 85, personY + 50);
        ctx.lineTo(toyX, toyY);
        ctx.stroke();

        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.moveTo(toyX, toyY);
        ctx.lineTo(toyX - 15, toyY + 25);
        ctx.lineTo(toyX + 15, toyY + 25);
        ctx.closePath();
        ctx.fill();

        const catX = toyX - 40;
        const catY = 420;
        const catJump = Math.abs(Math.sin(time * 4)) * 60;

        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(catX, catY - catJump, 60, 35);
        ctx.beginPath();
        ctx.arc(catX + 60, catY - catJump + 17, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(catX + 65, catY - catJump);
        ctx.lineTo(catX + 55, catY - catJump - 15);
        ctx.lineTo(catX + 60, catY - catJump);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(catX + 75, catY - catJump);
        ctx.lineTo(catX + 85, catY - catJump - 15);
        ctx.lineTo(catX + 80, catY - catJump);
        ctx.fill();

        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(catX + 70, catY - catJump + 15, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    animateRabbitPlay(ctx, time) {
        const personX = 400;
        const personY = 310;

        ctx.fillStyle = '#9370DB';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Playing with Rabbit!', 250, 50);

        // Draw realistic person sitting
        this.drawRealisticPerson(ctx, personX, personY, time, 'sitting');

        const rabbitX = personX - 70;
        const rabbitY = 430;
        const hop = time % 1 < 0.5 ? Math.sin((time % 1) * Math.PI * 2) * 30 : 0;

        ctx.fillStyle = '#FFF';
        ctx.fillRect(rabbitX, rabbitY - hop, 50, 40);
        ctx.beginPath();
        ctx.arc(rabbitX + 50, rabbitY - hop + 20, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(rabbitX + 45, rabbitY - hop - 30, 8, 35);
        ctx.fillRect(rabbitX + 60, rabbitY - hop - 30, 8, 35);

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(rabbitX + 60, rabbitY - hop + 15, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.font = '16px Arial';
        ctx.fillText('🥕', personX - 30, personY + 50);
    }

    animateHamsterPlay(ctx, time) {
        const personX = 400;
        const personY = 260;

        ctx.fillStyle = '#FFA500';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Playing with Hamster!', 250, 50);

        // Draw realistic person holding hamster
        this.drawRealisticPerson(ctx, personX, personY, time, 'holding');

        const handX = personX;
        const handY = personY + 90 + Math.sin(time * 2) * 10;

        const hamsterRotate = Math.sin(time * 3) * 0.3;
        ctx.save();
        ctx.translate(handX, handY - 10);
        ctx.rotate(hamsterRotate);

        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(-5, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(-8, -3, 3, 0, Math.PI * 2);
        ctx.arc(-2, -3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -3, 1.5, 0, Math.PI * 2);
        ctx.arc(-2, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    closeVideo() {
        const videoOverlay = document.getElementById('video-overlay');
        const canvas = document.getElementById('animation-canvas');

        this.animationRunning = false;
        videoOverlay.style.display = 'none';

        // Clean up ball game event listeners if they exist
        if (this.ballGameHandlers) {
            canvas.removeEventListener('mousedown', this.ballGameHandlers.mouseDownHandler);
            canvas.removeEventListener('mousemove', this.ballGameHandlers.mouseMoveHandler);
            canvas.removeEventListener('mouseup', this.ballGameHandlers.mouseUpHandler);
            this.ballGameHandlers = null;
        }

        // Clean up cat game event listeners if they exist
        if (this.catGameHandlers) {
            canvas.removeEventListener('mousemove', this.catGameHandlers.mouseMoveHandler);
            this.catGameHandlers = null;
        }

        // Clear game states
        this.ballGame = null;
        this.catGame = null;
    }

    animateAnimal(animal, type) {
        const mesh = animal.mesh;
        const startY = mesh.position.y;
        let animationTime = 0;

        const animate = () => {
            animationTime += 0.05;

            switch(type) {
                case 'bounce':
                    mesh.position.y = startY + Math.abs(Math.sin(animationTime * 5)) * 0.5;
                    break;
                case 'jump':
                    mesh.position.y = startY + Math.abs(Math.sin(animationTime * 3)) * 1.5;
                    break;
                case 'spin':
                    mesh.rotation.y += 0.2;
                    break;
                case 'grow':
                    const scale = 1 + Math.sin(animationTime * 8) * 0.1;
                    mesh.scale.set(scale, scale, scale);
                    break;
            }

            if (animationTime < Math.PI) {
                requestAnimationFrame(animate);
            } else {
                mesh.position.y = startY;
                mesh.scale.set(1, 1, 1);
            }
        };

        animate();
    }

    handleMovement() {
        const speed = 0.15;
        let moved = false;

        if (this.keys['w'] || this.keys['arrowup']) {
            this.playerPosition.z -= speed;
            moved = true;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.playerPosition.z += speed;
            moved = true;
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.playerPosition.x -= speed;
            moved = true;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.playerPosition.x += speed;
            moved = true;
        }

        this.playerPosition.x = Math.max(-20, Math.min(20, this.playerPosition.x));
        this.playerPosition.z = Math.max(-15, Math.min(20, this.playerPosition.z));
    }

    updateCamera() {
        const camX = this.playerPosition.x + Math.sin(this.cameraAngle) * this.cameraDistance;
        const camZ = this.playerPosition.z + Math.cos(this.cameraAngle) * this.cameraDistance;

        this.camera.position.set(camX, this.cameraHeight, camZ);
        this.camera.lookAt(this.playerPosition.x, 2, this.playerPosition.z);
    }

    updateAnimals(time) {
        const currentTime = Date.now();

        this.animals.forEach(animal => {
            this.updateAnimalMovement(animal, currentTime);
            this.updateAnimalAnimation(animal);

            if (time % 120 === 0) {
                animal.stats.happiness = Math.max(0, animal.stats.happiness - 0.5);
                animal.stats.hunger = Math.min(100, animal.stats.hunger + 0.7);
                animal.stats.cleanliness = Math.max(0, animal.stats.cleanliness - 0.3);

                if (this.selectedAnimal === animal) {
                    this.updateStatsUI();
                }
            }
        });
    }

    updateAnimalMovement(animal, currentTime) {
        const movement = animal.movement;

        if (currentTime > movement.nextMoveTime && !movement.isWalking) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.5 + Math.random() * 1.2;
            movement.targetX = animal.platformCenter.x + Math.cos(angle) * distance;
            movement.targetZ = animal.platformCenter.z + Math.sin(angle) * distance;
            movement.isWalking = true;
        }

        if (movement.isWalking) {
            const dx = movement.targetX - animal.mesh.position.x;
            const dz = movement.targetZ - animal.mesh.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > 0.05) {
                const moveX = (dx / distance) * movement.speed;
                const moveZ = (dz / distance) * movement.speed;
                animal.mesh.position.x += moveX;
                animal.mesh.position.z += moveZ;

                const targetAngle = Math.atan2(dx, dz);
                animal.mesh.rotation.y = targetAngle;
            } else {
                movement.isWalking = false;
                movement.nextMoveTime = currentTime + movement.idleTime;
            }
        }
    }

    updateAnimalAnimation(animal) {
        const tail = animal.mesh.children.find(child =>
            child.geometry && child.geometry.type === 'CylinderGeometry' && child.position.z < -1
        );

        if (tail) {
            animal.animations.tailWag += animal.movement.isWalking ? 0.15 : 0.08;
            tail.rotation.z = Math.sin(animal.animations.tailWag) * 0.4;
        }

        if (animal.movement.isWalking) {
            animal.animations.walkCycle += 0.15;
            const walkBob = Math.abs(Math.sin(animal.animations.walkCycle)) * 0.15;
            animal.mesh.position.y = 1.1 + walkBob;

            const legs = animal.mesh.children.filter(child =>
                child.geometry && child.geometry.type === 'CylinderGeometry' &&
                child.position.y < -0.4 && child.position.z > -1
            );

            legs.forEach((leg, index) => {
                const phase = animal.animations.walkCycle + (index % 2) * Math.PI;
                leg.rotation.x = Math.sin(phase) * 0.3;
            });
        } else {
            animal.animations.bobPhase += 0.02;
            const bobAmount = Math.sin(animal.animations.bobPhase) * 0.05;
            animal.mesh.position.y = 1.1 + bobAmount;

            const legs = animal.mesh.children.filter(child =>
                child.geometry && child.geometry.type === 'CylinderGeometry' &&
                child.position.y < -0.4 && child.position.z > -1
            );

            legs.forEach((leg) => {
                leg.rotation.x = 0;
            });
        }

        this.updateDirtiness(animal);
    }

    updateDirtiness(animal) {
        const cleanlinessPercent = animal.stats.cleanliness / 100;
        const dirtAmount = 1 - cleanlinessPercent;

        const body = animal.mesh.children.find(child => child.name === 'body');
        const belly = animal.mesh.children.find(child => child.name === 'belly');
        const head = animal.mesh.children.find(child => child.name === 'head');

        if (body && body.material) {
            const baseColor = new THREE.Color(animal.baseColor);
            const dirtColor = new THREE.Color(0x654321);
            body.material.color.copy(baseColor).lerp(dirtColor, dirtAmount * 0.6);
        }

        if (belly && belly.material) {
            const baseColor = new THREE.Color(animal.baseColor).offsetHSL(0, -0.2, 0.3);
            const dirtColor = new THREE.Color(0x4a3829);
            belly.material.color.copy(baseColor).lerp(dirtColor, dirtAmount * 0.5);
        }

        if (head && head.material) {
            const baseColor = new THREE.Color(animal.baseColor);
            const dirtColor = new THREE.Color(0x654321);
            head.material.color.copy(baseColor).lerp(dirtColor, dirtAmount * 0.6);
        }

        if (dirtAmount > 0.5 && animal.dirtParticles.length === 0) {
            this.addDirtParticles(animal);
        } else if (dirtAmount <= 0.1 && animal.dirtParticles.length > 0) {
            this.removeDirtParticles(animal);
        }
    }

    addDirtParticles(animal) {
        for (let i = 0; i < 8; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a3829,
                roughness: 0.9
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

            const angle = (i / 8) * Math.PI * 2;
            const radius = 0.8 + Math.random() * 0.4;
            particle.position.set(
                Math.cos(angle) * radius,
                -0.2 + Math.random() * 0.8,
                Math.sin(angle) * radius * 0.7
            );

            animal.mesh.add(particle);
            animal.dirtParticles.push(particle);
        }
    }

    removeDirtParticles(animal) {
        animal.dirtParticles.forEach(particle => {
            animal.mesh.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        });
        animal.dirtParticles = [];
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.handleMovement();
        this.updateCamera();
        this.updateAnimals(Date.now());

        this.renderer.render(this.scene, this.camera);
    }
}

const game = new PetShopGame();
