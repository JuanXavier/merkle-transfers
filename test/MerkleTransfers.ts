import { expect } from "chai"
import { ethers } from "hardhat"
import fs from "fs"

const adminData = fs.readFileSync("data/admin.json").toString()
const executorData = fs.readFileSync("data/executor.json").toString()
const INITIAL_MINT_AMOUNT = ethers.utils.parseEther("1000")
const TRANSFER_TO_CONTRACT_AMOUNT = ethers.utils.parseEther("10")
const { root } = JSON.parse(adminData)
let { addresses, amounts, proofs } = JSON.parse(executorData)

describe("Merkle Multi Transfers", async function () {
  let deployer: any, executor: any, user1: any, user2: any

  const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

  before(async function () {
    ;[deployer, executor, user1, user2] = await ethers.getSigners()
    const Token = await ethers.getContractFactory("MyToken")
    this.token = await (await Token.deploy(INITIAL_MINT_AMOUNT)).deployed()
    const MerkleTransfers = await ethers.getContractFactory("MerkleTransfers")
    this.merkleTransfers = await (await MerkleTransfers.deploy(executor.address, this.token.address)).deployed()
    console.log(`Token deployed to ${this.token.address}`)
    console.log(`Merkle deployed to ${this.merkleTransfers.address}`)
    console.log("")
  })

  describe("Owner functionality", async function () {
    it("Owner and executor addresses are settled", async function () {
      expect(await this.merkleTransfers.owner()).to.eq(deployer.address)
      expect(await this.merkleTransfers.executor()).to.eq(executor.address)
    })

    it("Owner should have correct token balance after deploying", async function () {
      let deployerBalance = String(await this.token.balanceOf(deployer.address))
      expect(deployerBalance).to.eq(INITIAL_MINT_AMOUNT)
    })

    it("Owner should be able to submit root", async function () {
      await this.merkleTransfers.changeMerkleRoot(root)
      expect(await this.merkleTransfers.merkleRoot()).to.eq(root)
    })

    it("Owner should be able to change executor", async function () {
      await this.merkleTransfers.changeExecutor(deployer.address)
      expect(await this.merkleTransfers.executor()).to.eq(deployer.address)
      await this.merkleTransfers.changeExecutor(executor.address)
      expect(await this.merkleTransfers.executor()).to.eq(executor.address)
    })

    it("Owner should be able to change token address", async function () {
      await this.merkleTransfers.changeToken(WETH9)
      expect(await this.merkleTransfers.token()).to.eq(WETH9)
      await this.merkleTransfers.changeToken(this.token.address)
      expect(await this.merkleTransfers.token()).to.eq(this.token.address)
    })

    it("Owner should be able to transfer tokens to contract", async function () {
      await this.token.connect(deployer).transfer(this.merkleTransfers.address, TRANSFER_TO_CONTRACT_AMOUNT)
      let merkleTransfersBalance = String(await this.token.balanceOf(this.merkleTransfers.address))
      expect(merkleTransfersBalance).to.eq(TRANSFER_TO_CONTRACT_AMOUNT)
    })
  })

  describe("Executor functionality", async function () {
    it("Executor should NOT be able to submit root", async function () {
      await expect(this.merkleTransfers.connect(executor).changeMerkleRoot(root)).to.be.revertedWithCustomError(
        this.merkleTransfers,
        "Unauthorized"
      )
    })

    it("Executor should NOT be able to change executor", async function () {
      await expect(this.merkleTransfers.connect(executor).changeExecutor(user1.address)).to.be.revertedWithCustomError(
        this.merkleTransfers,
        "Unauthorized"
      )
    })

    it("Executor should NOT be able to change token address", async function () {
      await expect(this.merkleTransfers.connect(executor).changeToken(WETH9)).to.be.revertedWithCustomError(
        this.merkleTransfers,
        "Unauthorized"
      )
    })

    it("Only executor should be able to make transfers", async function () {
      await expect(
        this.merkleTransfers.connect(deployer).multiProofTransfer(addresses, amounts, proofs)
      ).to.be.revertedWithCustomError(this.merkleTransfers, "Unauthorized")

      await expect(
        this.merkleTransfers.connect(user1).multiProofTransfer(addresses, amounts, proofs)
      ).to.be.revertedWithCustomError(this.merkleTransfers, "Unauthorized")
    })

    it("Executor can make multiTransfers", async function () {
      await this.merkleTransfers.connect(executor).multiProofTransfer(addresses, amounts, proofs)
      let merkleTransfersBalance = String(await this.token.balanceOf(this.merkleTransfers.address))
      expect(merkleTransfersBalance).to.be.lt(INITIAL_MINT_AMOUNT)
      expect(await this.token.balanceOf(addresses[0])).to.be.eq(String(amounts[0]))
      expect(await this.token.balanceOf(addresses[1])).to.be.eq(String(amounts[1]))
      expect(await this.token.balanceOf(addresses[2])).to.be.eq(String(amounts[2]))
      expect(await this.token.balanceOf(addresses[3])).to.be.eq(String(amounts[3]))
      expect(await this.token.balanceOf(addresses[4])).to.be.eq(String(amounts[4]))
      expect(await this.token.balanceOf(addresses[5])).to.be.eq(String(amounts[5]))
      expect(await this.token.balanceOf(addresses[6])).to.be.eq(String(amounts[6]))
      expect(await this.token.balanceOf(addresses[7])).to.be.eq(String(amounts[7]))
    })

    it("Executor can NOT make duplicated transfers", async function () {
      await expect(
        this.merkleTransfers.connect(executor).singleTransfer(addresses[0], amounts[0], proofs[0])
      ).to.be.revertedWithCustomError(this.merkleTransfers, "AlreadyExecutedTransfer")
    })
  })
})

describe("Merkle Single Transfers", async function () {
  let deployer: any, executor: any, user1: any, user2: any

  before(async function () {
    ;[deployer, executor, user1, user2] = await ethers.getSigners()
    const Token = await ethers.getContractFactory("MyToken")
    this.token = await (await Token.deploy(INITIAL_MINT_AMOUNT)).deployed()
    const MerkleTransfers = await ethers.getContractFactory("MerkleTransfers")
    this.merkleTransfers = await (await MerkleTransfers.deploy(executor.address, this.token.address)).deployed()
    await this.merkleTransfers.changeMerkleRoot(root)
    await this.token.connect(deployer).transfer(this.merkleTransfers.address, TRANSFER_TO_CONTRACT_AMOUNT)
  })

  describe("Single transfer functionality", async function () {
    it("Executor can make individual transfers", async function () {
      await this.merkleTransfers.connect(executor).singleTransfer(addresses[0], amounts[0], proofs[0])
      await this.merkleTransfers.connect(executor).singleTransfer(addresses[4], amounts[4], proofs[4])
      await this.merkleTransfers.connect(executor).singleTransfer(addresses[7], amounts[7], proofs[7])

      let addr0 = String(await this.token.balanceOf(addresses[0]))
      let addr4 = String(await this.token.balanceOf(addresses[4]))
      let addr7 = String(await this.token.balanceOf(addresses[7]))

      expect(addr0).to.be.eq(String(amounts[0]))
      expect(addr4).to.be.eq(String(amounts[4]))
      expect(addr7).to.be.eq(String(amounts[7]))
    })
  })
})
