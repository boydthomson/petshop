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
        this.scene.background = new THREE.Color(0xb8d4e8);
        this.scene.fog = new THREE.Fog(0xb8d4e8, 30, 70);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
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

        for (let i = 0; i < 50; i += 5) {
            for (let j = 0; j < 50; j += 2) {
                const plankGeometry = new THREE.PlaneGeometry(1.8, 4.8);
                const plankMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0.08 + Math.random() * 0.02, 0.4, 0.35 + Math.random() * 0.1),
                    roughness: 0.85,
                    metalness: 0.0
                });
                const plank = new THREE.Mesh(plankGeometry, plankMaterial);
                plank.rotation.x = -Math.PI / 2;
                plank.position.set(i - 25, 0.01, j - 25);
                plank.receiveShadow = true;
                this.scene.add(plank);
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
            color: 0xf5f5f5,
            roughness: 0.8,
            side: THREE.DoubleSide
        });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 10;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);
    }

    createWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4e4c1,
            roughness: 0.85
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

        const baseboard = new THREE.Mesh(
            new THREE.BoxGeometry(50, 0.3, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x5d4e37, roughness: 0.7 })
        );
        baseboard.position.set(0, 0.15, -24.85);
        baseboard.castShadow = true;
        this.scene.add(baseboard);
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
                const dogEarGeo = new THREE.BoxGeometry(0.4, 0.8, 0.1);
                const leftDogEar = new THREE.Mesh(dogEarGeo, bodyMaterial);
                leftDogEar.position.set(-0.6, 0.6, 0.8);
                leftDogEar.rotation.set(0, 0, 0.6);
                leftDogEar.castShadow = true;
                group.add(leftDogEar);
                const rightDogEar = new THREE.Mesh(dogEarGeo, bodyMaterial);
                rightDogEar.position.set(0.6, 0.6, 0.8);
                rightDogEar.rotation.set(0, 0, -0.6);
                rightDogEar.castShadow = true;
                group.add(rightDogEar);
                break;

            case 'cat':
                const catEarGeo = new THREE.ConeGeometry(0.25, 0.5, 4);
                const leftCatEar = new THREE.Mesh(catEarGeo, bodyMaterial);
                leftCatEar.position.set(-0.4, 1.2, 0.9);
                leftCatEar.rotation.z = -0.2;
                leftCatEar.castShadow = true;
                group.add(leftCatEar);
                const rightCatEar = new THREE.Mesh(catEarGeo, bodyMaterial);
                rightCatEar.position.set(0.4, 1.2, 0.9);
                rightCatEar.rotation.z = 0.2;
                rightCatEar.castShadow = true;
                group.add(rightCatEar);
                break;

            case 'rabbit':
                const rabbitEarGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.2, 12);
                const leftRabbitEar = new THREE.Mesh(rabbitEarGeo, bodyMaterial);
                leftRabbitEar.position.set(-0.3, 1.4, 0.7);
                leftRabbitEar.rotation.set(0.3, 0, 0.1);
                leftRabbitEar.castShadow = true;
                group.add(leftRabbitEar);
                const rightRabbitEar = new THREE.Mesh(rabbitEarGeo, bodyMaterial);
                rightRabbitEar.position.set(0.3, 1.4, 0.7);
                rightRabbitEar.rotation.set(0.3, 0, -0.1);
                rightRabbitEar.castShadow = true;
                group.add(rightRabbitEar);
                break;

            case 'hamster':
                const hamsterEarGeo = new THREE.SphereGeometry(0.2, 16, 16);
                const leftHamsterEar = new THREE.Mesh(hamsterEarGeo, bodyMaterial);
                leftHamsterEar.position.set(-0.5, 1.0, 0.6);
                leftHamsterEar.scale.set(1, 0.6, 0.4);
                leftHamsterEar.castShadow = true;
                group.add(leftHamsterEar);
                const rightHamsterEar = new THREE.Mesh(hamsterEarGeo, bodyMaterial);
                rightHamsterEar.position.set(0.5, 1.0, 0.6);
                rightHamsterEar.scale.set(1, 0.6, 0.4);
                rightHamsterEar.castShadow = true;
                group.add(rightHamsterEar);
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
                    bodyScaleX: 1.1, bodyScaleY: 0.85, bodyScaleZ: 1.3,
                    bellySize: 0.65, bellyY: -0.25,
                    headSize: 0.65, headScaleX: 0.95, headScaleY: 0.95, headScaleZ: 0.9,
                    headY: 0.4, headZ: 1.1
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
                return { topRadius: 0.12, bottomRadius: 0.10, length: 0.6, yPos: -0.6 };
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
                tailGeometry = new THREE.CylinderGeometry(0.10, 0.05, 1.5, 12);
                tail = new THREE.Mesh(tailGeometry, bodyMaterial);
                tail.position.set(0, 0.2, -1.3);
                tail.rotation.x = Math.PI / 5;
                break;

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
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.95,
            metalness: 0.0
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
            roughness: 0.95
        }));
        belly.position.set(0, bodyProportions.bellyY, 0.3);
        belly.castShadow = true;
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

        const noseGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.1 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, bodyProportions.headY - 0.15, bodyProportions.headZ + 0.65);
        group.add(nose);

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfff4e0, 1.2);
        sunLight.position.set(15, 25, 15);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -30;
        sunLight.shadow.camera.right = 30;
        sunLight.shadow.camera.top = 30;
        sunLight.shadow.camera.bottom = -30;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.bias = -0.0001;
        this.scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);

        const ceilingLight1 = new THREE.PointLight(0xfff5e1, 0.6, 20);
        ceilingLight1.position.set(-10, 9, 0);
        ceilingLight1.castShadow = true;
        this.scene.add(ceilingLight1);

        const ceilingLight2 = new THREE.PointLight(0xfff5e1, 0.6, 20);
        ceilingLight2.position.set(10, 9, 0);
        ceilingLight2.castShadow = true;
        this.scene.add(ceilingLight2);

        const spotLight = new THREE.SpotLight(0xffffff, 0.5, 30, Math.PI / 6, 0.5);
        spotLight.position.set(0, 9.5, 0);
        spotLight.target.position.set(0, 0, 0);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);
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

        this.animationStartTime = Date.now();
        this.animationRunning = true;
        this.animatePlayScene(ctx, animalType);

        setTimeout(() => {
            this.closeVideo();
        }, 30000);
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
        this.animationRunning = false;
        videoOverlay.style.display = 'none';
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
