'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

const options = {
    bitcoinfiles_api_base: 'http://localhost:8082',
}

describe('outputfilter', () => {
    it('Handle base error cases', async () => {
        var bf = index.instance(options);

        try {
            await bf.saveOutputFilter([]);
            expect(true).to.eql(false);
        } catch (ex) {
            expect(ex).to.eql({
                success: false,
                code: 422,
                error: '',
                message: 'invalid arguments'
            });
        }

        try {
            await bf.saveOutputFilter(['3b508a9da0879dd55619e06f5bd656696f77ba879aaa99e0eb22cedd7dd4846']);
            expect(true).to.eql(false);
        } catch (ex) {
            expect(ex).to.eql({
                success: false,
                code: 422,
                error: '',
                message: 'invalid arguments'
            });
        }

        try {
            await bf.saveOutputFilter(['adsfdf3kji']);
            expect(true).to.eql(false);
        } catch (ex) {
            expect(ex).to.eql({
                success: false,
                code: 422,
                error: '',
                message: 'invalid arguments'
            });
        }

        try {
            await bf.saveOutputFilter(['dc36f3baa3a9b7e96827928760c07a160579b0a531814e3a3900c1c4112c4a92*e7']);
            expect(true).to.eql(false);
        } catch (ex) {
            expect(ex).to.eql({
                success: false,
                code: 422,
                error: '',
                message: 'invalid arguments'
            });
        }

        try {
            await bf.saveOutputFilter(['dc36f3baa9b7e96827928760c07a160579b0a531814e3a3900c1c4112c4a92e7--0']);
            expect(true).to.eql(false);
        } catch (ex) {
            expect(ex).to.eql({
                success: false,
                code: 422,
                error: '',
                message: 'invalid arguments'
            });
        }
    });

    it('Create and get outputfilter', async () => {
        var bf = index.instance(options);
        const saveResult = await bf.saveOutputFilter({
            add: [
                '12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9',
                '12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9', // remove duplicates
                '0c629d7b8069f917b7f31942db3ec94bf4c4662e17c05b1d5c059e448d1470af-2',
                '1ALSfdsAHraUzu8HhAE9Cep9ca1ju3fjt2',
                '65503f4f336d4528fec7e645f81f1bfd655e837e8460c33b677f6995955e0b95',
            ]
        });
        expect(saveResult).to.eql({
           "result": {
               "id": "7d268cf780d4ce5dd81adf4f4e97957126e867550463f2afb3f458102fb036d0"
            },
            "success": true,
        });
        const result = await bf.getOutputFilter(saveResult.result.id);
        expect(result).to.eql(
            [ '12UhHtxuMMftNodp5nwoDYfBd4QaLm6Sz9',
              '0c629d7b8069f917b7f31942db3ec94bf4c4662e17c05b1d5c059e448d1470af-2',
              '1ALSfdsAHraUzu8HhAE9Cep9ca1ju3fjt2',
              '65503f4f336d4528fec7e645f81f1bfd655e837e8460c33b677f6995955e0b95' ]
        );
    });

    it('current Query block by direct outputfilter address', async () => {
        var bf = index.instance(options);
        const result = await bf.getBlockFiltered('0000000000000000010fa8e8773dbdb932e4a1c6ca4a3e67a2ed6313c435da6a', {
            base: '',
            outputFilter: [
                '1PV44Gis1aRJk7Zk2yub8C3b6yuwxLjv5g',
            ]
        });

        expect(result).to.eql([
            {
                h: 'fd8af901d4781e54baecbb602379b0df9298f086ed8cdf0a04c545ebda24c990',
                tx: '0100000001881822aa5f1e953ec11747d27f604ac7192ea4d56e081a587622692d75d840d2010000006b483045022100f2f0f079fca089b55b76660941aef613f5779e6ea3352951daf7a70cf9dc48a1022012361a8b1adc06ae82c7e625535a45ddcd154144757d9c67724004481ad41cec4121039194be3e977e3478cad51364cbd2f0266a3683ac2eb302df087c1b49bea3ac82ffffffff02ec5d6300000000001976a914f6a0f72cadd176d0a869a869b69aabb63407dc3988ac6818e302000000001976a9147c3eb666ac6341aa6bf3eb70aebeb50410b6591b88ac00000000'
            }
        ]);
    });

    it('current Query block by direct outputfilter scripthash', async () => {
        var bf = index.instance(options);
        const result = await bf.getBlockFiltered('000000000000000003f300c429b08e8be8dee046a3992dac70a617c84d3d84b4', {
            base: '',
            outputFilter: [
                // good boostpow
                '8ab229baca00310074d868ac669fdad9a62ecbf41fd4bae8c86b77fdd0633c4a'
            ]
        });

        expect(result).to.eql([
            {
                h: '247b08b11530fad37f4e48a41365cd3ef7cefd9e9c964efbe5a2fe5e09f08d37',
                tx: '010000000106d38c455b8e388e3465bae2e77d26285284f74e4f4b8093377af1f30df496fa030000006b48304502210080731ab74395a49bdd068cfe634bfc300a5d8de4f3a0d552d93efc39be840cc00220741ccd8554c4407952cc312e96386d1129640fed6e105b348973b455f781bad8412102f071275247e9dabad8f92e53ebbe13e66f87a740ca76055112ed009f05fa0602ffffffff02d007000000000000e108626f6f7374706f77750442000000200e0e0e6d9ba73cfbcc9be54514eaa1fa75a90fe9ebaca3e7d67ba7199b28484004ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac1c3a6903000000001976a9142418d7376628810a7e067bddf16401d0a828fdff88ac00000000'
            }
        ]);

    });

    it('current Query block by direct outputfilter txo', async () => {
        var bf = index.instance(options);
        const result = await bf.getBlockFiltered('0000000000000000010fa8e8773dbdb932e4a1c6ca4a3e67a2ed6313c435da6a', {
            base: '',
            outputFilter: [
                'c3e989ab1ad6d7d5eb579f7bc64ef97dcb828526be4dc21b8684f6352bee8c8b-2'
            ]
        });

        expect(result).to.eql([
            {
                h: 'a5194b2f0bae50d2e9009d4aba5fef7a8241027ae5b519777476dda34b1f07f5',
                tx: '01000000018b8cee2b35f684861bc24dbe268582cb7df94ec67b9f57ebd5d7d61aab89e9c3020000006a473044022001118390f57ebd65846b1ddac2368f2897d1aee92fca411b0f4bf8dfb21dca1f022018b64c297a281896e6712a4e2854cfc23c112e389ed88b7727009c4b92f8c2474121032687f9d8781da550e0e1fff44e226979770113d1fafc9b4e0b9bd1361d3b0d77ffffffff020000000000000000fd8f01006a223144535869386876786e36506434546176686d544b7855374255715337636e7868770c59423950385a50553532513617e9bb91e9be99e6b19f2fe9bb91e6b2b32fe5aba9e6b19f19323032302d30342d32335431313a30303a30302b30383a30304c657b22617169223a223235222c22706d3235223a2237222c22706d3130223a223133222c22736f32223a2238222c226e6f32223a2237222c22636f223a22302e343030222c226f33223a223739222c22706f6c223a6e756c6c2c22717561223a22e4bc98227d4cc278da7dd04b0ac2301405d0bd645c4a5e7e4dba1571501c09b151d491089d14f7503a5070013a753d56e82e7ca9d2af38cae586979c647620c9664962c22409c87a854b4c44138162048e79ebd8b74d9ba4302d1c061afad2718c51e4879c2571bab716677609b6cfc7b5ce8aea9ee1a6f585a421135a51ea0b7f04b02814460136c7a0c5a80e637a18dd62e45f8c865f982a2f5ee74b5fc20d0c25920a319034ef9f4a3a08a85662a692cff5534979abcbd3e85b24d7a36f01c13d66fe06c7686d9822020000000000001976a914666675d887a7ae09835af934096d9fcbbb70eed288ac00000000'
            }
        ]);

    });

    it('current Query block by direct outputfilter txid', async () => {
        var bf = index.instance(options);
        const result = await bf.getBlockFiltered('0000000000000000010fa8e8773dbdb932e4a1c6ca4a3e67a2ed6313c435da6a', {
            base: '',
            outputFilter: [
                'ff653680b8476242851dc548334558b7361ae772a401c49558d072a8c5e1833d'
            ]
        });

        expect(result).to.eql([
            {
                h: 'ff653680b8476242851dc548334558b7361ae772a401c49558d072a8c5e1833d',
                tx: '0100000002f9ba58b1bacf58c6bc5da7000866f26873f221de41746dabc3f929ffe9b03dbc020000006a47304402207384b1565623ba86078d58d420b06b5689e969773086656f193519f85bf4596e022072527873b4ae0e9e0c1ca386e3672201299e4b26914eb4b59c9e6c7064727d3d4121029a902c83ab7b473d37762d7a9478311e5f3f506ee19fe25f11a035b21bab2e42ffffffffc585bcbd4d527d4fa7356e2366430b46c6aae31f89585e84529f2da1bf38db25020000006b483045022100f93c2f75dbfe736103520b718c16b620957728d73aeb32e0e82c1215b987e9e2022037c19632c6b5da714a39c01cfea24005c5ca27c898b3e53b49fcd74ff838d3ff4121029a902c83ab7b473d37762d7a9478311e5f3f506ee19fe25f11a035b21bab2e42ffffffff0488130000000000001976a914671f952809ce9071ff65c26bee6fa6033a19e5b288ac00000000000000000e006a0b81a164a7506c61796572316a0d0000000000001976a914859246b84127969f7bfb8dadc2cb917d235451f288ac2c0c0000000000001976a914859246b84127969f7bfb8dadc2cb917d235451f288ac00000000'
            },
            {
                h: '3d83d26810d16748b06f602d9765d5aa01508c589e68378a5141e33a1e09dac0',
                tx: '01000000031cec2324a3b0bdebf8ef63ccf1ddd5c3ccfd87a1724d560598f6f8ebd86ce59e020000006a47304402205d141272cf8ddaf73e18dfcd528b1bd0cf16d31a5ad1de8b6f7f8a21a7af5cdc0220586128c8d5073440f486b65e3deb234e311ad8a792b07c8686c8eb771e67609c412103593c94d59ddb26ea32f7d936201c0134e92a0b0aba65fba74c8fb2788a954b76ffffffff38f793626035186052203c7d80ceaf7b09b8efaed6d2a7de0d9f44277fdb45fa030000006a47304402202a71c6f2c7aa7e9495f59b6d3436232a3daea0b44b2b27c6a3f7c2c09327920802203027c76f4eab1f061b535318ff20f259dcb55b7f6a3e6601b1d0bf5910b6218f412103593c94d59ddb26ea32f7d936201c0134e92a0b0aba65fba74c8fb2788a954b76ffffffff3d83e1c5a872d05895c401a472e71a36b758453348c51d85426247b8803665ff000000006a47304402203d686da3b8596fd59d4ac70636d511acb7cc280810eb59605d6d5506fc6d10a902205b955533792eb749f2a4632d3a9a84cfeb07ce83267c94ac49cd1ad744d265b1412103593c94d59ddb26ea32f7d936201c0134e92a0b0aba65fba74c8fb2788a954b76ffffffff0422020000000000001976a914859246b84127969f7bfb8dadc2cb917d235451f288ac00000000000000000e006a0b82a16480a174ce5ea113bcc15c1000000000001976a914671f952809ce9071ff65c26bee6fa6033a19e5b288acef450000000000001976a914671f952809ce9071ff65c26bee6fa6033a19e5b288ac00000000'
            }
        ]);

    });

});

