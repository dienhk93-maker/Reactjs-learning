import { Document, FilterQuery } from 'mongoose';

export interface BaseRepository<T extends Document> {
  /**
   * Create a new document
   * @param createDto - Data to create the document with
   * @returns Promise of the created document
   */
  create(createDto: Partial<T>): Promise<T>;

  /**
   * Find all documents with optional filter
   * @param filter - Optional filter criteria
   * @returns Promise of array of documents
   */
  findAll(filter?: FilterQuery<T>): Promise<T[]>;

  /**
   * Find a document by ID
   * @param id - Document ID
   * @returns Promise of the document or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find one document by filter criteria
   * @param filter - Filter criteria
   * @returns Promise of the document or null if not found
   */
  findOne(filter: FilterQuery<T>): Promise<T | null>;

  /**
   * Update a document by ID
   * @param id - Document ID
   * @param updateDto - Data to update the document with
   * @returns Promise of the updated document or null if not found
   */
  update(id: string, updateDto: Partial<T>): Promise<T | null>;

  /**
   * Delete a document by ID
   * @param id - Document ID
   * @returns Promise of the deleted document or null if not found
   */
  delete(id: string): Promise<T | null>;

  /**
   * Count documents with optional filter
   * @param filter - Optional filter criteria
   * @returns Promise of the count
   */
  count?(filter?: FilterQuery<T>): Promise<number>;

  /**
   * Check if a document exists by ID
   * @param id - Document ID
   * @returns Promise of boolean indicating existence
   */
  exists?(id: string): Promise<boolean>;
}